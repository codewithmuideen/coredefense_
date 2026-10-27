import { ImageResponse } from "next/og";

// Square home-screen icon (the favicon PNG is not square, which iOS and Android would distort).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1E6AFF 0%, #0B1220 100%)",
        }}
      >
        <svg width="112" height="112" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>
    ),
    size
  );
}
