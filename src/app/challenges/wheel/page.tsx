import type { Metadata } from "next";
import { WheelGame } from "@/components/games/WheelGame";

export const metadata: Metadata = {
  title: "عجلة الحظ | Spin the Wheel",
  description: "تحدي عجلة الحظ التفاعلية من IEEE OCS SB — لف العجلة واكسب جوائز وشارات رقمية.",
};

export default function WheelPage() {
  return <WheelGame />;
}
