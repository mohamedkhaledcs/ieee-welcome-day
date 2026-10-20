import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/tracks",
    "/challenges",
    "/challenges/wheel",
    "/challenges/quiz",
    "/challenges/puzzle",
    "/challenges/flip",
    "/challenges/wordsearch",
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/challenges" ? 0.9 : 0.7,
  }));
}
