import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: process.env.SITE_NAME || "Dream Team Roofing & Gutters",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;600;700&family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-neutral-900">{children}</body>
    </html>
  );
}
