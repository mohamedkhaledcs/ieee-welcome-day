import type { Metadata } from "next";
import { WordSearchGame } from "@/components/games/WordSearchGame";

export const metadata: Metadata = {
  title: "البحث عن الكلمات | Word Search",
  description: "ابحث عن الكلمات المستهدفة في شبكة الحروف التفاعلية بدون حروف مشتركة من IEEE OCS SB.",
};

export default function WordSearchPage() {
  return <WordSearchGame />;
}
