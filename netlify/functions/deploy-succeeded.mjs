// Netlify runs this after every successful deploy. It tells search engines that
// support IndexNow (Bing, and through it DuckDuckGo and Yahoo, plus Yandex)
// which public pages to read. Google uses the sitemap instead.
const KEY = "3c263edc57973021452be1aaad3dfdd6";

export default async (req) => {
  let context = "";
  try {
    context = (await req.json())?.payload?.context ?? "";
  } catch {
    // not a deploy event
  }
  if (context !== "production") return new Response(null, { status: 204 });

  const site = (process.env.URL || "https://rescuen-web.netlify.app").replace(/\/+$/, "");
  const xml = await (await fetch(`${site}/sitemap.xml`)).text();
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!urlList.length) return new Response(null, { status: 204 });

  const origin = new URL(urlList[0]).origin;
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(origin).host, key: KEY, keyLocation: `${origin}/${KEY}.txt`, urlList }),
  });
  console.log(`[indexnow] ${urlList.length} pages -> ${res.status}`);
  return new Response(null, { status: 204 });
};
