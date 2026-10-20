import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التحديات | Challenges",
  description:
    "العب خمس تحديات تفاعلية — عجلة الحظ، تحدي الأسئلة، لقّط اللوجو، تدوير الكروت، وبورد الحروف.",
};

export default function ChallengesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
