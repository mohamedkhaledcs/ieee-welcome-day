import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم | Dashboard",
  description: "لوحة تحكم محلية — تعرض بيانات المتصفح الحالي فقط.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
