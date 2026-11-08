"use client";

/**
 * BHAAMA VEEDHI — Hero Section
 * Exactly matched to design mockup:
 * - Left: Eyebrow, "Everyday Elegance, Made for You.", subtext, "SHOP NOW →" pill button, carousel dots
 * - Right: Scalloped dish with bow earrings on champagne silk drapery with baby's breath flowers
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";

export function Hero() {
  const setView = useStore((s) => s.setView);
  const setCategory = useStore((s) => s.setCategory);
  const [activeSlide, setActiveSlide] = useState(0);

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
    <section className="relative overflow-hidden bg-[#FAF6F0] border-b border-[#E8DAD5]/60">
      {/* Background silk drapery texture */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-35 mix-blend-multiply">
        <img
          src="/brand/hero-banner.jpg"
          alt=""
          className="h-full w-full object-cover object-center filter blur-[1px]"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Typography & CTA */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-center text-left">
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs sm:text-sm uppercase tracking-[0.28em] font-medium text-[#8B6C61] mb-3"
            >
              A Little Something Beautiful
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.12] text-[#592534] tracking-tight"
            >
              Everyday Elegance,
              <span className="block italic font-serif text-[#592534] mt-1 sm:mt-2">
                Made for You.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-5 max-w-md text-sm sm:text-base text-[#493B37] leading-relaxed font-sans"
            >
              Discover jewellery that adds a little charm to every look.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <Button
                onClick={shopCollection}
                size="lg"
                className="rounded-full bg-[#6B2C3E] px-8 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#52212f] hover:shadow-lg hover:scale-102"
              >
                SHOP NOW <span className="ml-1 text-sm">→</span>
              </Button>
            </motion.div>

            {/* Slider Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 flex items-center gap-2"
            >
              <button
                onClick={() => setActiveSlide(0)}
                aria-label="Slide 1"
                className={`h-2 rounded-full transition-all ${
                  activeSlide === 0
                    ? "w-6 bg-[#6B2C3E]"
                    : "w-2 bg-[#D6B98C]/60 hover:bg-[#6B2C3E]/60"
                }`}
              />
              <button
                onClick={() => setActiveSlide(1)}
                aria-label="Slide 2"
                className={`h-2 rounded-full transition-all ${
                  activeSlide === 1
                    ? "w-6 bg-[#6B2C3E]"
                    : "w-2 bg-[#D6B98C]/60 hover:bg-[#6B2C3E]/60"
                }`}
              />
              <button
                onClick={() => setActiveSlide(2)}
                aria-label="Slide 3"
                className={`h-2 rounded-full transition-all ${
                  activeSlide === 2
                    ? "w-6 bg-[#6B2C3E]"
                    : "w-2 bg-[#D6B98C]/60 hover:bg-[#6B2C3E]/60"
                }`}
              />
            </motion.div>
          </div>

          {/* Right Column: Hero Visual on Scalloped Dish */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-6 lg:col-span-6 flex items-center justify-center relative"
          >
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl shadow-xl border border-[#D6B98C]/30 bg-white/40 backdrop-blur-xs group">
              <img
                src="/brand/hero-plate.jpg"
                alt="Bhaama Veedhi bow earrings displayed on scalloped ceramic dish"
                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-104"
              />
              {/* Subtle ambient light glow */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#FAF6F0]/20 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
