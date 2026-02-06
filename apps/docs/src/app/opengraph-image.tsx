import { ImageResponse } from "next/og";

export const alt = "Deenruv - Modern E-commerce Platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #09090b 0%, #0c0a1a 50%, #09090b 100%)",
        position: "relative",
      }}
    >
      {/* Subtle gradient accent overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.12) 0%, transparent 60%)",
          display: "flex",
        }}
      />

      {/* Logo - cube using flat colors */}
      <div style={{ display: "flex", marginBottom: 40 }}>
        <svg
          width="120"
          height="120"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 12L4 30L20 38L20 20L4 12Z" fill="#4338ca" />
          <path d="M36 12L36 30L20 38L20 20L36 12Z" fill="#6366f1" />
          <path d="M24 16L32 12L32 24L24 28L24 16Z" fill="#312e81" />
          <path d="M4 12L20 4L36 12L20 20L4 12Z" fill="#818cf8" />
          <path d="M24 16L32 12L24 8L16 12L24 16Z" fill="#1e1b4b" />
        </svg>
      </div>

      {/* Title */}
      <div
        style={{
          display: "flex",
          fontSize: 64,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          marginBottom: 16,
        }}
      >
        Deenruv
      </div>

      {/* Subtitle */}
      <div
        style={{
          display: "flex",
          fontSize: 28,
          color: "#a1a1aa",
          letterSpacing: "0.02em",
        }}
      >
        Modern E-commerce Platform
      </div>

      {/* Tags row */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 40,
        }}
      >
        {["TypeScript", "GraphQL", "Open Source"].map((tag) => (
          <div
            key={tag}
            style={{
              display: "flex",
              padding: "8px 20px",
              borderRadius: 999,
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#818cf8",
              fontSize: 18,
            }}
          >
            {tag}
          </div>
        ))}
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #6366f1, #06b6d4)",
          display: "flex",
        }}
      />
    </div>,
    {
      ...size,
    },
  );
}
