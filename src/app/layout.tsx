import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { BackNavigationManager } from "@/components/bv/BackNavigationManager";

/* ============================================================
   BHAAMA VEEDHI — Typography (Brand Direction: Minimal Luxury)
   Headings: Cormorant Garamond (refined luxury serif)
   Body/UI:  Poppins (clean, readable modern sans-serif)
   ============================================================ */
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bhaama Veedhi — Styled for Every Bhaama ✨",
  description:
    "Everyday elegance, made for you. Discover handcrafted dainty and minimal jewellery that adds a little charm to every look.",
  keywords: [
    "Bhaama Veedhi",
    "dainty jewellery",
    "everyday jewellery",
    "minimal jewellery",
    "gold jewellery",
    "Indian jewellery",
    "necklaces",
    "earrings",
    "bangles",
    "bracelets",
    "rings",
    "premium jewellery",
  ],
  authors: [{ name: "Bhaama Veedhi" }],
  icons: {
    icon: "/brand/logo.png",
    shortcut: "/favicon.ico",
    apple: "/brand/logo.png",
  },
  openGraph: {
    title: "Bhaama Veedhi — Everyday Elegance, Made for You ✨",
    description:
      "A little love, a little sparkle & a whole lot of pretty. Discover jewellery designed for your everyday style.",
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
        className={`${poppins.variable} ${cormorant.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <BackNavigationManager />
        <Toaster />
      </body>
    </html>
  );
}
