import type { Metadata } from "next";
import { QuizGame } from "@/components/games/QuizGame";

export const metadata: Metadata = {
  title: "اختبار التحدي | Quiz Challenge",
  description: "اختبر معلوماتك التقنية وأسئلة تكنولوجيا المعلومات من IEEE OCS SB.",
};

export default function QuizPage() {
  return <QuizGame />;
}
