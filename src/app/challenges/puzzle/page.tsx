import type { Metadata } from "next";
import { PuzzleGame } from "@/components/games/PuzzleGame";

export const metadata: Metadata = {
  title: "لغز الشعار | Logo Puzzle",
  description: "ركب قطع شعار IEEE OCS SB المبعثرة واجمع اللوجو بالكامل في تحدي البازل التفاعلي.",
};

export default function PuzzlePage() {
  return <PuzzleGame />;
}
