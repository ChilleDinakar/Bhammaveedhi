import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

/* ============================================================
   BHAAMA VEEDHI — Typography
   Headings: Playfair Display (elegant serif)
   Body/UI:  Inter (clean sans-serif)
   ============================================================ */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bhaama Veedhi — Every woman deserves a little sparkle ✨",
  description:
    "Bhaama Veedhi — premium handcrafted jewelry. Elegant necklaces, earrings, bangles & rings. Every woman deserves a little sparkle in her everyday story.",
  keywords: [
    "Bhaama Veedhi",
    "jewelry",
    "gold jewelry",
    "Indian jewelry",
    "necklaces",
    "earrings",
    "bangles",
    "rings",
    "premium jewelry",
  ],
  authors: [{ name: "Bhaama Veedhi" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Bhaama Veedhi — Premium Handcrafted Jewelry",
    description:
      "Every woman deserves a little sparkle in her everyday story ✨",
    siteName: "Bhaama Veedhi",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
