/** Shared layout for generated Open Graph images (rendered by next/og, so inline styles only). */
export const OG_SIZE = { width: 1200, height: 630 };

/** Graph paper, ink, and one line of red pen. Matches the site's light theme. */
export function OgCard({ eyebrow, title, subtitle, footer }: { eyebrow: string; title: string; subtitle: string; footer: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#f4f0e4",
        backgroundImage:
          "linear-gradient(rgba(29,90,160,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(29,90,160,0.13) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        color: "#1c2740",
        fontFamily: "serif",
        borderLeft: "10px solid #b8321c",
      }}
    >
      <div style={{ display: "flex", fontSize: 26, letterSpacing: 3, color: "#b8321c", textTransform: "uppercase", fontFamily: "monospace" }}>§ {eyebrow}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", fontSize: 92, lineHeight: 1.02, letterSpacing: -1 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 34, color: "#565d74", lineHeight: 1.3, maxWidth: 1000, fontFamily: "sans-serif" }}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", fontSize: 26, fontFamily: "monospace", color: "#1c2740", borderTop: "2px solid #1c2740", paddingTop: 16 }}>{footer}</div>
    </div>
  );
}
