"use client";

/**
 * BHAAMA VEEDHI — Storefront
 * Composes the Hero, category filter, and responsive product gallery.
 * Fetches products from /api/products and stores them in the shared Zustand
 * store so the Navbar can derive its category links dynamically.
 * Category chips are derived from the products themselves — any category the
 * admin types in shows up here automatically.
 */
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, PackageOpen } from "lucide-react";
import { Hero } from "./Hero";
import { ProductCard } from "./ProductCard";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

export function StoreFront() {
  const [loading, setLoading] = useState(true);
  const products = useStore((s) => s.products);
  const setProducts = useStore((s) => s.setProducts);
  const activeCategory = useStore((s) => s.activeCategory);
  const setCategory = useStore((s) => s.setCategory);
  // Derive categories from the catalogue (memoized for a stable array identity).
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setProducts(data.products || []);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setProducts]);

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter(
          (p) => p.category.trim().toLowerCase() === activeCategory.trim().toLowerCase()
        );

  return (
    <>
      <Hero />

      {/* Collection */}
      <section id="collection" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-gold-dark"
          >
            <span className="h-px w-8 bg-gold/50" />
            <Sparkles className="size-4" />
            <span className="text-xs font-medium uppercase tracking-[0.25em]">
              The Collection
            </span>
            <Sparkles className="size-4" />
            <span className="h-px w-8 bg-gold/50" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 font-serif text-3xl font-bold text-maroon sm:text-4xl"
          >
            Curated for Every Story
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base"
          >
            Each piece is handcrafted to add a little sparkle to your everyday —
            timeless designs made to be worn and remembered.
          </motion.p>
        </div>

        {/* Category filter (derived dynamically from the catalogue) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all",
                activeCategory.trim().toLowerCase() === cat.trim().toLowerCase()
                  ? "bg-maroon text-cream shadow-md"
                  : "border border-gold/30 bg-white text-foreground/70 hover:border-gold hover:text-maroon"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-gold-dark" />
            <p className="text-sm">Unveiling the collection…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
            <PackageOpen className="size-10 text-gold-dark" />
            <p className="font-serif text-lg text-maroon">No pieces here yet</p>
            <p className="text-sm">Try another category or check back soon.</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Brand promise strip */}
      <section className="border-y border-gold/20 bg-cream-deep/40">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            {
              title: "Handcrafted",
              text: "Every piece made by skilled artisans.",
            },
            {
              title: "Premium Materials",
              text: "Antique gold & ethically sourced stones.",
            },
            {
              title: "Personal Service",
              text: "Order on WhatsApp — we guide you personally.",
            },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <h3 className="font-serif text-lg font-semibold text-maroon">
                {f.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
