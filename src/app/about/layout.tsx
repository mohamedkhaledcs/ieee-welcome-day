import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن | About Us",
  description:
    "تعرف على IEEE OCS SB Student Activity — مجتمع طلابي نشط في معهد العبور يقدم تراكات تقنية وغير تقنية.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
