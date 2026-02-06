import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Apple touch icon with the cube logo on dark background
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#09090b",
        borderRadius: "22%",
      }}
    >
      <svg
        width="140"
        height="140"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left face */}
        <path d="M4 12L4 30L20 38L20 20L4 12Z" fill="#4338ca" />
        {/* Right face */}
        <path d="M36 12L36 30L20 38L20 20L36 12Z" fill="#6366f1" />
        {/* Corner cutout on right face */}
        <path d="M24 16L32 12L32 24L24 28L24 16Z" fill="#312e81" />
        {/* Top face */}
        <path d="M4 12L20 4L36 12L20 20L4 12Z" fill="#818cf8" />
        {/* Corner cutout on top face */}
        <path d="M24 16L32 12L24 8L16 12L24 16Z" fill="#1e1b4b" />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
