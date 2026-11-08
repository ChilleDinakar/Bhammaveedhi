"use client";

/**
 * BHAAMA VEEDHI — Hero Section
 * Brand Direction: Minimal Luxury & Everyday Elegance
 * Visual: Warm, natural, minimal photography with editorial serif typography
 * - Caption: "A LITTLE SOMETHING BEAUTIFUL"
 * - Title: "Everyday Elegance, Made for You."
 * - Subtext: "Discover jewellery that adds a little charm to every look."
 * - CTAs: "SHOP NOW" (Solid Maroon) & "EXPLORE COLLECTION" (Outline)
 */
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
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

  const exploreCategories = () => {
    setView("store");
    setTimeout(() => {
      document
        .getElementById("categories")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#F8F3EE] border-b border-[#E8DAD5]">
      {/* Background with luxury subtle warm styling */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/products/hero.png"
          alt="Bhaama Veedhi jewellery aesthetic"
          className="h-full w-full object-cover object-center opacity-30 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F3EE]/80 via-[#F8F3EE]/60 to-[#F8F3EE]" />
      </div>

      {/* Decorative Champagne Gold ambient glows */}
      <div className="pointer-events-none absolute -left-20 top-12 size-80 rounded-full bg-[#D6B98C]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 size-96 rounded-full bg-[#E8DAD5]/40 blur-3xl" />

      <div className="mx-auto flex min-h-[74vh] max-w-5xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        {/* Caption */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 mb-4"
        >
          <span className="h-px w-6 bg-[#D6B98C]" />
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#8B6C61]">
            A Little Something Beautiful
          </span>
          <span className="h-px w-6 bg-[#D6B98C]" />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.1] text-[#6B2C3E] max-w-4xl"
        >
          Everyday Elegance,
          <span className="block italic font-normal mt-1 sm:mt-2 text-[#6B2C3E]">
            Made for You.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-sm sm:text-base md:text-lg text-[#493B37] font-normal leading-relaxed"
        >
          Discover jewellery that adds a little charm to every look. Handcrafted pieces
          designed to celebrate confidence, beauty, and individuality.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4"
        >
          <Button
            onClick={shopCollection}
            size="lg"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#6B2C3E] text-white hover:bg-[#85374E] text-xs sm:text-sm font-semibold tracking-widest uppercase rounded-sm shadow-md transition-all hover:shadow-lg"
          >
            SHOP NOW
          </Button>

          <Button
            onClick={exploreCategories}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto px-8 py-3.5 border-[#6B2C3E] text-[#6B2C3E] hover:bg-[#E8DAD5]/40 text-xs sm:text-sm font-semibold tracking-widest uppercase rounded-sm transition-all"
          >
            EXPLORE CATEGORIES
          </Button>
        </motion.div>

        {/* Trust badge note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex items-center gap-4 text-[11px] text-[#8B6C61] tracking-wide"
        >
          <span>Free shipping above ₹499</span>
          <span>•</span>
          <span>Dainty & Everyday Wear</span>
          <span>•</span>
          <span>WhatsApp Assisted Order</span>
        </motion.div>
      </div>
    </section>
  );
}
