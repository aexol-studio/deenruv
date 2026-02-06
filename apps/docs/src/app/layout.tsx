import type { Metadata } from "next";

// This root layout is a pass-through.
// The real layout with <html>/<body> is in [lang]/layout.tsx.
// Root page.tsx just redirects to /${defaultLanguage}.

export const metadata: Metadata = {
  title: "Deenruv - Modern E-commerce Platform",
  description:
    "A flexible, headless e-commerce framework built on NestJS and GraphQL",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
