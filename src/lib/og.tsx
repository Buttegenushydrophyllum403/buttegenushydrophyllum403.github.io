/** Shared layout for generated Open Graph images (rendered by next/og, so inline styles only). */
export const OG_SIZE = { width: 1200, height: 630 };

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
        background: "#0a0f1f",
        backgroundImage: "radial-gradient(circle at 85% 15%, rgba(255,95,162,0.35), transparent 45%), radial-gradient(circle at 10% 90%, rgba(111,208,255,0.25), transparent 40%)",
        color: "#e9edf7",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            width: 64,
            height: 64,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #ff5fa2, #ffcc4d)",
            color: "white",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          RS
        </div>
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#5cf2a8", textTransform: "uppercase" }}>● {eyebrow}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 36, color: "#a3adc9", lineHeight: 1.3, maxWidth: 1000 }}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", fontSize: 26, color: "#ffcc4d" }}>{footer}</div>
    </div>
  );
}
