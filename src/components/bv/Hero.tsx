"use client";

/**
 * BHAAMA VEEDHI — Hero Section
 * Seamless full-width wide luxury jewelry photography banner:
 * - Background: Continuous 2728x960 champagne silk draped photography with scalloped dish & bow earrings on the right
 * - Left overlay: "A LITTLE SOMETHING BEAUTIFUL", "Everyday Elegance, Made for You.", subtitle, "SHOP NOW →" pill button, dots
 */
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";

export function Hero() {
  const setView = useStore((s) => s.setView);
  const setCategory = useStore((s) => s.setCategory);

  const shopCollection = () => {
    setCategory("All");
    setView("store");
    setTimeout(() => {
      document
        .getElementById("collection")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF2EB] border-b border-[#E8DAD5]/60 min-h-[460px] sm:min-h-[520px] md:min-h-[560px] lg:min-h-[620px] flex items-center">
      {/* Full-width continuous photography background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/brand/hero-bg-seamless.jpg"
          alt="Bhaama Veedhi — Everyday Elegance, Made for You"
          className="h-full w-full object-cover object-right sm:object-center"
        />
        {/* Soft atmospheric gradient on small screens to guarantee text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF2EB]/80 via-[#FAF2EB]/40 to-transparent sm:hidden" />
      </div>

      {/* Typography Overlay on Left */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 py-12 sm:py-16 md:py-20">
        <div className="max-w-xl text-left">
          {/* Eyebrow: A LITTLE SOMETHING BEAUTIFUL */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.25em] font-medium text-[#7E6258] mb-3"
          >
            A LITTLE SOMETHING BEAUTIFUL
          </motion.p>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3.5xl sm:text-5xl md:text-6xl lg:text-[66px] font-normal leading-[1.08] text-[#592534] tracking-tight"
          >
            Everyday Elegance,
            <span className="block italic font-serif text-[#592534] mt-1 sm:mt-2">
              Made for You.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 sm:mt-5 max-w-md text-xs sm:text-sm md:text-base text-[#493B37] leading-relaxed font-sans"
          >
            Discover jewellery that adds a little charm to every look.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-7 sm:mt-8"
          >
            <Button
              onClick={shopCollection}
              size="lg"
              className="rounded-full bg-[#6B2C3E] px-8 sm:px-9 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#52212f] hover:shadow-lg hover:scale-102"
            >
              SHOP NOW <span className="ml-1 text-sm">→</span>
            </Button>
          </motion.div>

          {/* Carousel Pagination Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-7 sm:mt-8 flex items-center gap-2 pl-1"
          >
            <span className="size-2 rounded-full bg-[#592534]" />
            <span className="size-2 rounded-full border border-[#8B6C61]/70 bg-transparent" />
            <span className="size-2 rounded-full border border-[#8B6C61]/70 bg-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
