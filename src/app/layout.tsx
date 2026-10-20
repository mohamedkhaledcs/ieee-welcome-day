import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/layout/Providers";
import { ContextMenu } from "@/components/ui/ContextMenu";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "IEEE OCS SB Challenge | تحدي IEEE OCS SB",
    template: "%s | IEEE OCS SB Challenge",
  },
  description:
    "موقع IEEE OCS SB Student Activity — اكتشف التراكات التقنية، العب التحديات التفاعلية، وتابع أنشطتنا في معهد العبور.",
  keywords: [
    "IEEE OCS SB",
    "معهد العبور",
    "الأنشطة الطلابية",
    "Front-End",
    "Cyber Security",
    "Flutter",
    "تحدي",
    "Student Activity",
  ],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: "en_US",
    siteName: "IEEE OCS SB Challenge",
    title: "IEEE OCS SB Challenge | تحدي IEEE OCS SB",
    description:
      "اكتشف IEEE OCS SB — تراكات تقنية، تحديات تفاعلية، وأنشطة طلابية في معهد العبور.",
    images: [{ url: "/images/logo.jpg", width: 512, height: 512, alt: "IEEE OCS SB Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IEEE OCS SB Challenge",
    description:
      "IEEE OCS SB Student Activity — interactive challenges and technical tracks.",
    images: ["/images/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cairo.variable} antialiased flex flex-col min-h-screen`}
      >
        <Providers>
          <CustomCursor />
          <ContextMenu />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
