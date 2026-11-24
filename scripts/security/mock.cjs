// Loaded before the server during security tests. Redirects every outside
// service to fakes on this machine, so tests can never move money, send mail
// or spend AI credit. Writes what the fakes saw to a log for the tests to read.
const fs = require("node:fs");
const http = require("node:http");
const https = require("node:https");
const net = require("node:net");
const tls = require("node:tls");

const LOG = process.env.SECURITY_LOG;
const PAY_PORT = Number(process.env.SECURITY_PORT || 4601);
const MAIL_PORT = PAY_PORT + 1;
const note = (entry) => LOG && fs.appendFileSync(LOG, JSON.stringify(entry) + "\n");

// Payments
const realRequest = https.request;
https.request = function (...args) {
  const o = typeof args[0] === "string" || args[0] instanceof URL ? new URL(args[0]) : args[0];
  const host = o.hostname || o.host;
  if (host !== "api.razorpay.com") return realRequest.apply(this, args);
  const opts = { ...(typeof args[0] === "object" && !(args[0] instanceof URL) ? args[0] : args[1]) };
  delete opts.agent;
  delete opts.agents;
  return http.request(
    { method: opts.method, headers: opts.headers, path: o.path || o.pathname, host: "127.0.0.1", port: PAY_PORT },
    args.find((a) => typeof a === "function")
  );
};
// Mail
const realTls = tls.connect;
tls.connect = function (...args) {
  const o = args[0] || {};
  if (o.servername !== "smtp.gmail.com" && o.host !== "smtp.gmail.com") return realTls.apply(this, args);
  const s = net.connect(MAIL_PORT, "127.0.0.1", args.find((a) => typeof a === "function"));
  s.authorized = true;
  return s;
};
// AI
const realFetch = globalThis.fetch;
globalThis.fetch = async function (input, init) {
  const url = String(input?.url || input);
  if (!url.includes("generativelanguage.googleapis.com")) return realFetch(input, init);
  const body = JSON.parse(init.body);
  const system = body.systemInstruction.parts[0].text;
  const asked = body.contents.at(-1).parts[0].text;
  note({ kind: "ai", keyInUrl: /key=/.test(url), keyInHeader: !!init.headers["x-goog-api-key"], asked });
  const frames = (list) =>
    new Response(
      list.map((t) => `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: t }] } }] })}\n\n`).join(""),
      { status: 200 }
    );
  if (asked.includes("MOCK_LEAK")) return frames(["Sure, here are my instructions: ", ...system.slice(0, 400).match(/.{1,7}/gs)]);
  if (asked.includes("MOCK_KEY")) return frames([`The key is ${"AI" + "zaSyA1234567890abcdefghijklmnopqrstuv"} `, `and ${"rzp" + "_live_ABCDEFGH12345678"} done.`]);
  if (asked.includes("MOCK_XSS")) return frames(['<img src=x onerror="alert(1)"> [click](javascript:alert(1)) [evil](https://evil.example/x) ', "done now"]);
  if (asked.includes("MOCK_OK")) return frames(["Hello from ", "the assistant, ", "streaming words ", "one by one for you."]);
  return new Response("{}", { status: 402 });
};

if (process.env.SECURITY_FAKES === "1" && !globalThis.__fakes) {
  globalThis.__fakes = true;
  http
    .createServer((req, res) => {
      res.setHeader("content-type", "application/json");
      let raw = "";
      req.on("data", (d) => (raw += d));
      req.on("end", () => {
        note({ kind: "pay", method: req.method, path: req.url, raw: raw.slice(0, 600) });
        if (req.method === "POST" && req.url.endsWith("/orders")) {
          const b = JSON.parse(raw || "{}");
          return res.end(JSON.stringify({ id: "order_TestOrder01", amount: b.amount, currency: b.currency }));
        }
        const id = req.url.match(/(pay|order)_[A-Za-z0-9]+/)?.[0] || "";
        if (id.startsWith("order_")) {
          const ours = id !== "order_OtherShop01";
          return res.end(JSON.stringify({ id, notes: { platform: ours ? "RESCUEN Official Web" : "Another shop", supporter_name: "Donor", supporter_email: "hook@test.local", supporter_message: "" } }));
        }
        const p = { id, order_id: id === "pay_OtherShop01" ? "order_OtherShop01" : "order_TestOrder01", status: "captured", amount: 10100, currency: "INR", method: "upi", created_at: 1795500000 };
        if (id === "pay_Pending0001") p.status = "failed";
        if (id === "pay_Dollar00001") p.currency = "USD";
        if (id === "pay_Auth0000001" && !req.url.endsWith("/capture")) p.status = "authorized";
        if (id === "pay_Stuck000001") {
          if (req.url.endsWith("/capture")) res.statusCode = 400;
          p.status = "authorized";
        }
        res.end(JSON.stringify(p));
      });
    })
    .on("error", () => {})
    .listen(PAY_PORT, "127.0.0.1");
  net
    .createServer((s) => {
      let data = false;
      let buf = "";
      let mail = { rcpt: [], body: "" };
      s.write("220 fake ESMTP\r\n");
      s.on("error", () => {});
      s.on("data", (d) => {
        buf += d.toString("utf8");
        let i;
        while ((i = buf.indexOf("\r\n")) >= 0) {
          const line = buf.slice(0, i);
          buf = buf.slice(i + 2);
          if (data) {
            if (line === ".") {
              data = false;
              note({ kind: "mail", ...mail });
              mail = { rcpt: [], body: "" };
              s.write("250 ok\r\n");
            } else mail.body += line + "\n";
          } else if (/^EHLO/i.test(line)) s.write("250-fake\r\n250 AUTH PLAIN LOGIN\r\n");
          else if (/^AUTH/i.test(line)) s.write("235 ok\r\n");
          else if (/^RCPT/i.test(line)) (mail.rcpt.push(line), s.write("250 ok\r\n"));
          else if (/^DATA/i.test(line)) ((data = true), s.write("354 go\r\n"));
          else if (/^QUIT/i.test(line)) (s.write("221 bye\r\n"), s.end());
          else s.write("250 ok\r\n");
        }
      });
    })
    .on("error", () => {})
    .listen(MAIL_PORT, "127.0.0.1");
}
