"use client";

/**
 * BHAAMA VEEDHI — Hero Section
 * Cinematic, full-width. Deep maroon background with glowing gold accents.
 * Displays the tagline + "Shop Collection" CTA.
 */
import { motion } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";
import { useStore } from "@/store/useStore";
import { BRAND } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function Hero() {
  const setView = useStore((s) => s.setView);
  const setCategory = useStore((s) => s.setCategory);

  const shopCollection = () => {
    setCategory("All");
    setView("store");
    // Scroll to the gallery
    setTimeout(() => {
      document
        .getElementById("collection")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <section className="relative isolate overflow-hidden bg-maroon">
      {/* Background image with cinematic overlay */}
      <div className="absolute inset-0 -z-10">
        { }
        <img
          src="/products/hero.png"
          alt="Bhaama Veedhi fine jewelry"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-dark/90 via-maroon/80 to-maroon-dark/95" />
      </div>

      {/* Glowing gold accents */}
      <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-gold/20 blur-3xl glow-gold" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-96 rounded-full bg-gold/15 blur-3xl glow-gold" />

      <div className="mx-auto flex min-h-[78vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 rounded-full border border-gold/40 bg-cream/5 px-4 py-1.5 backdrop-blur-sm"
        >
          <Sparkles className="size-4 text-gold-light" />
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-gold-light">
            Handcrafted Fine Jewelry
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-4xl font-serif text-4xl font-bold leading-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Every woman deserves a little{" "}
          <span className="text-gold-gradient">sparkle</span> in her everyday
          story <span className="inline-block animate-pulse">✨</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-base text-cream/80 sm:text-lg"
        >
          Discover Bhaama Veedhi — a curated collection of timeless necklaces,
          earrings, bangles & rings, crafted to become part of your everyday
          narrative.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Button
            onClick={shopCollection}
            size="lg"
            className="gap-2 bg-gold px-8 text-maroon-dark shadow-lg transition-all hover:bg-gold-light hover:shadow-gold/30"
          >
            Shop Collection
          </Button>
          <a
            href={`https://wa.me/${BRAND.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-cream/30 px-8 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-cream/10"
          >
            Talk to us on WhatsApp
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.button
          onClick={shopCollection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-cream/60 transition-colors hover:text-gold-light"
          aria-label="Scroll to collection"
        >
          <ChevronDown className="size-6 animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
}
