import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Simplified cube logo for favicon using flat colors
// (Satori doesn't reliably support SVG linearGradient in defs)
export default function Icon() {
  return new ImageResponse(
    <svg
      width="32"
      height="32"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left face (dark indigo-cyan) */}
      <path d="M4 12L4 30L20 38L20 20L4 12Z" fill="#4338ca" />
      {/* Right face (indigo-cyan gradient approximation) */}
      <path d="M36 12L36 30L20 38L20 20L36 12Z" fill="#6366f1" />
      {/* Corner cutout on right face (deep dark) */}
      <path d="M24 16L32 12L32 24L24 28L24 16Z" fill="#312e81" />
      {/* Top face (lighter indigo-cyan) */}
      <path d="M4 12L20 4L36 12L20 20L4 12Z" fill="#818cf8" />
      {/* Corner cutout on top face (darkest) */}
      <path d="M24 16L32 12L24 8L16 12L24 16Z" fill="#1e1b4b" />
    </svg>,
    {
      ...size,
    },
  );
}
