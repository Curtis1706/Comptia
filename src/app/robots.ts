import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://ceilow.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/comptabilite/",
          "/facturation/",
          "/paie/",
          "/tva/",
          "/reporting/",
          "/documents/",
          "/parametres/",
          "/login",
          "/register",
          "/verify-email",
          "/access-denied",
          "/_next/",
        ],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
