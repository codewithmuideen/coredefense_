import { ImageResponse } from "next/og";

// Default social-share card for every page that doesn't define its own.
export const alt = "CoreDefense: cybersecurity, process transformation, engineering and AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0B1220",
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(30,106,255,0.45), transparent 45%), radial-gradient(circle at 10% 100%, rgba(30,106,255,0.25), transparent 40%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#528BFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>CoreDefense</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Secure. Transform. Engineer. Automate.
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "rgba(255,255,255,0.65)" }}>
            One senior UK team for security, process, software and AI.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["Cybersecurity", "Business Transformation", "Digital Engineering", "AI & Automation"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.2)",
                fontSize: 22,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
