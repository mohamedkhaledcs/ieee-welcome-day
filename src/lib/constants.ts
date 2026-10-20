export const socialLinks = {
  linktree: "https://linktr.ee/ieeeobourcs",
  website: "https://ibms-blond.vercel.app/",
  tiktok: "https://www.tiktok.com/@ieee.obour.cs",
  linkedin: "https://www.linkedin.com/company/ieee-obour-institute/posts/",
  instagram: "https://www.instagram.com/ieee_ocs",
  facebook:
    "https://www.facebook.com/profile.php?id=100086469804756&mibextid=ZbWKwL",
} as const;

export const technicalTracks = [
  "Front-End",
  "Back-End",
  "Cyber Security",
  "Data Analysis",
  "Flutter",
  "UI/UX",
] as const;

export const nonTechnicalTracks = ["Media", "HR", "PR"] as const;

export const gameIds = [
  "wheel",
  "quiz",
  "puzzle",
  "flip",
  "wordsearch",
] as const;

export type GameId = (typeof gameIds)[number];

export const MAX_ATTEMPTS = 3;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ieee-ocs-sb-challenge.vercel.app";
