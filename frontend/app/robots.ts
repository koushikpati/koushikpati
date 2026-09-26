// FILE PATH: src/app/robots.ts
// Next.js auto-generates /robots.txt from this file. No manual robots.txt needed.

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://yourdomain.com/sitemap.xml", // <-- replace with your real domain
  };
}
