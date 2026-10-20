import type { Metadata } from "next";
import { FlipGame } from "@/components/games/FlipGame";

export const metadata: Metadata = {
  title: "اقلب الورق | Flip Cards",
  description: "لعبة الذاكرة التفاعلية من IEEE OCS SB — طابق كروت التكنولوجيا واكتشف الأزواج المتشابهة.",
};

export default function FlipPage() {
  return <FlipGame />;
}
