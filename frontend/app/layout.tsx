// FILE PATH: src/app/layout.tsx
// This replaces/updates your existing root layout. Merge with whatever
// providers/fonts you already have there — don't just overwrite blindly
// if you have custom font loading etc.

import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const SITE_URL = "https://yourdomain.com"; // <-- replace with your real domain

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Your Name — Software Engineer",
    template: "%s | Your Name",
  },
  description:
    "Portfolio of Your Name — software engineer working on AI agents, backend systems, and full-stack applications.",
  keywords: ["software engineer", "portfolio", "full stack developer", "AI", "LangChain"],
  authors: [{ name: "Your Name", url: SITE_URL }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Your Name — Software Engineer",
    description:
      "Portfolio of Your Name — software engineer working on AI agents, backend systems, and full-stack applications.",
    siteName: "Your Name Portfolio",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Name — Software Engineer",
    description: "Portfolio of Your Name.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
