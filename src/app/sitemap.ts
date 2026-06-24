import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { countries } from "@/data/countries";

// V11.7 Part 2 — sitemap covers every public, indexable route. Country sub-pages are
// generated from the same data source that drives generateStaticParams on
// /countries/[slug], so this list always matches what actually builds (no dead links,
// no missing country routes).
const staticRoutes = [
  "",
  "/about",
  "/ai-assistant",
  "/before-you-fly",
  "/countries",
  "/disclaimer",
  "/early-access",
  "/faq",
  "/get-help",
  "/home-setup",
  "/partner-with-us",
  "/pricing",
  "/privacy",
  "/reference-links",
  "/refund-policy",
  "/security-and-data",
  "/services",
  "/share-story",
  "/start",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const countryEntries: MetadataRoute.Sitemap = countries.map((country) => ({
    url: `${SITE_URL}/countries/${country.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...countryEntries];
}
