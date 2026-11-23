"use client";

// Last line of defence: shown only if the whole layout fails, so it carries its own styles.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const code = error.digest ? `E-SITE-${error.digest}` : "E-SITE";
  const button = {
    display: "inline-block",
    padding: "14px 24px",
    borderRadius: 16,
    border: "1px solid #e5e9f2",
    fontWeight: 600,
    fontSize: 14,
    textDecoration: "none",
    cursor: "pointer",
  } as const;
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#fafbfe", color: "#0a2540", fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
        <main style={{ padding: 24, maxWidth: 440 }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>RESCUEN will be right back</h1>
          <p style={{ color: "#37415a", lineHeight: 1.6 }}>Please try again in a moment. In an emergency, call 112.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={reset} style={{ ...button, background: "#004aad", color: "#fff" }}>
              Try again
            </button>
            <a href={`mailto:rescuensupport@gmail.com?subject=${encodeURIComponent(`Website report (${code})`)}`} style={{ ...button, background: "#fff", color: "#0a2540" }}>
              Report
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
