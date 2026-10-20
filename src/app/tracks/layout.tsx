import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التراكات | Tracks",
  description:
    "استكشف التراكات التقنية وغير التقنية في IEEE OCS SB — Front-End, Back-End, Cyber Security, Flutter, UI/UX, Media, HR, PR.",
};

export default function TracksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
