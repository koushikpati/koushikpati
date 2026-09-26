// FILE PATH: src/app/sitemap.ts
// Next.js auto-generates /sitemap.xml from this file.

import type { MetadataRoute } from "next";

const SITE_URL = "https://yourdomain.com"; // <-- replace with your real domain

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
