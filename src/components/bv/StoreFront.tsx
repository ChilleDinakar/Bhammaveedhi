"use client";

/**
 * BHAAMA VEEDHI — Storefront
 * Brand Direction: Minimal Luxury & Everyday Elegance
 * Sections in order (from design specification):
 * 1. Hero Banner
 * 2. Shop by Category (Earrings, Necklaces, Bracelets, Chains/Rings)
 * 3. New Arrivals & Full Collection (with dynamic category pills + real-time search)
 * 4. Best Sellers / Curated Spotlight
 * 5. Trust & Promise Banner (Dusty Blush #E8DAD5)
 * 6. The Story of Bhaama Veedhi (Deep Maroon #6B2C3E)
 * 7. Customer Reviews ("Loved by Our Bhaamas")
 * 8. Instagram Reel & Community Showcase (@bhaama_veedhi 🤍)
 */
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Loader2,
  PackageOpen,
  Truck,
  Heart,
  MessageCircle,
  ShieldCheck,
  Star,
  Instagram,
  ArrowRight,
  Filter,
  X,
} from "lucide-react";
import { Hero } from "./Hero";
import { ProductCard } from "./ProductCard";
import { useStore, type Product } from "@/store/useStore";
import { BRAND } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StoreFront() {
  const [loading, setLoading] = useState(true);
  const products = useStore((s) => s.products);
  const setProducts = useStore((s) => s.setProducts);
  const activeCategory = useStore((s) => s.activeCategory);
  const setCategory = useStore((s) => s.setCategory);
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);

  // Derive distinct categories from current catalog
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  // Visual category cards
  const categoryCards = [
    {
      name: "Earrings",
      label: "Earrings",
      subtitle: "Chandbalis, studs & drops",
      image: "/products/earrings-chandbali.png",
    },
    {
      name: "Necklaces",
      label: "Necklaces",
      subtitle: "Dainty chains & chokers",
      image: "/products/necklace-vine.png",
    },
    {
      name: "Bangles",
      label: "Bracelets & Bangles",
      subtitle: "Kadas, stacks & cuffs",
      image: "/products/bangle-kada.png",
    },
    {
      name: "Rings",
      label: "Rings & Chains",
      subtitle: "Solitaires & cocktail rings",
      image: "/products/ring-solitaire.png",
    },
  ];

  // Fetch catalog on mount
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

  // Filter products by category AND search query
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        activeCategory === "All" ||
        p.category.trim().toLowerCase() === activeCategory.trim().toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // Pick top 4 products for Best Sellers
  const bestSellers = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  const selectCategoryAndScroll = (categoryName: string) => {
    setCategory(categoryName);
    setTimeout(() => {
      document.getElementById("collection")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <>
      {/* 1. Hero Banner */}
      <Hero />

      {/* 2. Shop by Category Section (White Background) */}
      <section id="categories" className="bg-white py-16 border-b border-[#E8DAD5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#8B6C61]">
              Explore by Style
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#6B2C3E]">
              Shop by Category
            </h2>
            <p className="mt-2 text-sm text-[#493B37]">
              Everyday luxury for every mood. Select a category to explore our curated pieces.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryCards.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => selectCategoryAndScroll(cat.name)}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-[#E8DAD5] bg-[#F8F3EE] transition-all hover:shadow-md hover:border-[#D6B98C]"
              >
                <div className="aspect-square overflow-hidden bg-[#F8F3EE]/80">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                </div>
                <div className="p-4 text-center bg-white/95 backdrop-blur-xs border-t border-[#E8DAD5]">
                  <h3 className="font-serif text-lg font-medium text-[#6B2C3E] group-hover:text-[#85374E] transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-[11px] text-[#8B6C61] mt-0.5">{cat.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. New Arrivals & Full Collection (Warm Ivory Background) */}
      <section id="collection" className="bg-[#F8F3EE] py-16 sm:py-20 border-b border-[#E8DAD5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#8B6C61]">
              New Arrivals
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-5xl font-normal text-[#6B2C3E]">
              Discover your new favourites ♡
            </h2>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-[#493B37]">
              Minimal, elegant, and timeless jewellery handcrafted to accompany your everyday story.
            </p>
          </div>

          {/* Dynamic Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded-full px-5 py-2 text-xs sm:text-sm font-medium transition-all tracking-wide",
                  activeCategory.trim().toLowerCase() === cat.trim().toLowerCase()
                    ? "bg-[#6B2C3E] text-white shadow-sm"
                    : "border border-[#E8DAD5] bg-white text-[#30272A]/80 hover:border-[#D6B98C] hover:text-[#6B2C3E]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Search Filter Banner */}
          {searchQuery && (
            <div className="mt-6 flex items-center justify-between rounded-lg border border-[#D6B98C] bg-white px-4 py-3 text-sm text-[#30272A]">
              <span>
                Showing results for <strong>&ldquo;{searchQuery}&rdquo;</strong> ({filtered.length} piece{filtered.length === 1 ? "" : "s"} found)
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="flex items-center gap-1 text-xs font-semibold text-[#6B2C3E] hover:underline"
              >
                <X className="size-3.5" /> Clear Search
              </button>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="mt-14 flex flex-col items-center justify-center gap-3 py-20 text-[#8B6C61]">
              <Loader2 className="size-8 animate-spin text-[#6B2C3E]" />
              <p className="text-sm">Unveiling our collection…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-14 flex flex-col items-center justify-center gap-3 py-20 text-center">
              <PackageOpen className="size-10 text-[#8B6C61]" />
              <p className="font-serif text-xl text-[#6B2C3E]">No pieces found</p>
              <p className="text-sm text-[#493B37]">
                Try selecting another category or clearing your search filter.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCategory("All");
                  setSearchQuery("");
                }}
                className="mt-3 border-[#6B2C3E] text-[#6B2C3E]"
              >
                View All Pieces
              </Button>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Best Sellers Spotlight (White Background) */}
      {products.length > 3 && (
        <section className="bg-white py-16 border-b border-[#E8DAD5]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#8B6C61]">
                  Most Loved
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-normal text-[#6B2C3E]">
                  Bhaama Best Sellers
                </h2>
              </div>
              <button
                onClick={() => selectCategoryAndScroll("All")}
                className="text-xs uppercase tracking-widest font-semibold text-[#6B2C3E] hover:text-[#85374E] flex items-center gap-1.5"
              >
                EXPLORE ALL PIECES <ArrowRight className="size-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {bestSellers.map((p, i) => (
                <ProductCard key={`bestseller-${p.id}`} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Trust & Promise Banner (Dusty Blush #E8DAD5) */}
      <section className="bg-[#E8DAD5] py-14 border-b border-[#D6B98C]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center p-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-white text-[#6B2C3E] shadow-xs mb-3">
                <Truck className="size-5 text-[#6B2C3E]" />
              </span>
              <h3 className="font-sans font-semibold text-sm text-[#30272A] tracking-wide">
                Dispatch in 3–4 Days
              </h3>
              <p className="mt-1 text-xs text-[#493B37] max-w-xs">
                Free tracked shipping across India on all orders above ₹499.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-white text-[#6B2C3E] shadow-xs mb-3">
                <Sparkles className="size-5 text-[#6B2C3E]" />
              </span>
              <h3 className="font-sans font-semibold text-sm text-[#30272A] tracking-wide">
                Premium Handcrafted Finish
              </h3>
              <p className="mt-1 text-xs text-[#493B37] max-w-xs">
                Subtle champagne-gold tones created for delicate everyday elegance.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-white text-[#6B2C3E] shadow-xs mb-3">
                <MessageCircle className="size-5 text-[#6B2C3E]" />
              </span>
              <h3 className="font-sans font-semibold text-sm text-[#30272A] tracking-wide">
                WhatsApp Order Assistance
              </h3>
              <p className="mt-1 text-xs text-[#493B37] max-w-xs">
                Chat directly with us for styling guidance, gift packing, and order queries.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-white text-[#6B2C3E] shadow-xs mb-3">
                <Heart className="size-5 text-[#6B2C3E]" />
              </span>
              <h3 className="font-sans font-semibold text-sm text-[#30272A] tracking-wide">
                Styled for Every Bhaama
              </h3>
              <p className="mt-1 text-xs text-[#493B37] max-w-xs">
                Jewellery that celebrates quiet confidence, beauty, and individuality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. The Story of Bhaama Veedhi (Deep Maroon #6B2C3E Background) */}
      <section id="story" className="bg-[#6B2C3E] text-[#F8F3EE] py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 top-0 size-72 rounded-full bg-[#D6B98C]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 size-72 rounded-full bg-[#D6B98C]/10 blur-3xl" />

        <div className="mx-auto max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-[#D6B98C]" />
            <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#D6B98C]">
              Our Heritage & Vision
            </span>
            <span className="h-px w-8 bg-[#D6B98C]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-white mb-6">
            The Story of Bhaama Veedhi
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#F8F3EE]/90 leading-relaxed font-normal mb-8 max-w-2xl mx-auto">
            A place where every Bhaama finds her style. Jewellery that celebrates confidence,
            beauty and individuality. We believe in everyday luxury—pieces delicate enough for
            your daily routine, yet enchanting enough to remember forever.
          </p>

          <a
            href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hello Bhaama Veedhi! I would love to learn more about your pieces and custom styling.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xs border border-[#D6B98C] px-8 py-3 text-xs uppercase tracking-[0.25em] font-semibold text-[#D6B98C] hover:bg-[#D6B98C] hover:text-[#6B2C3E] transition-all"
          >
            OUR STORY ♡
          </a>
        </div>
      </section>

      {/* 7. Customer Reviews Section (Warm Ivory #F8F3EE) */}
      <section id="reviews" className="bg-[#F8F3EE] py-20 border-b border-[#E8DAD5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#8B6C61]">
              Customer Love
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#6B2C3E]">
              Loved by Our Bhaamas
            </h2>
            <p className="mt-2 text-sm text-[#493B37]">
              Real stories from women who bring a little sparkle to their everyday.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "The quality and shine are breathtaking! Wore the Pearl Drop studs to work and received so many compliments. Dainty, lightweight, and so classy.",
                author: "Ananya R.",
                city: "Hyderabad",
                item: "Pearl Drop Studs",
              },
              {
                quote:
                  "Ordering on WhatsApp was so seamless. My package arrived within 3 days in beautiful packaging. It feels like unboxing a luxury gift to myself!",
                author: "Sneha M.",
                city: "Bengaluru",
                item: "Emerald Vine Necklace",
              },
              {
                quote:
                  "The gold tone is so subtle and elegant, not overly yellow or flashy. Truly everyday luxury at an affordable price. Definitely ordering again! 🤍",
                author: "Pooja K.",
                city: "Chennai",
                item: "Solitaire Diamond Ring",
              },
            ].map((rev, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-xl border border-[#E8DAD5] bg-white p-6 shadow-xs"
              >
                <div>
                  <div className="flex gap-1 text-[#D6B98C] mb-3">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="size-4 fill-[#D6B98C]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#493B37] leading-relaxed italic">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#F8F3EE] flex items-center justify-between">
                  <div>
                    <p className="font-sans font-semibold text-sm text-[#6B2C3E]">
                      {rev.author}
                    </p>
                    <p className="text-xs text-[#8B6C61]">{rev.city}</p>
                  </div>
                  <span className="text-[10px] bg-[#E8DAD5]/50 text-[#6B2C3E] px-2 py-0.5 rounded-full font-medium">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Instagram Reel & Community Showcase (White Background) */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-10">
            <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#8B6C61]">
              Social Community
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#6B2C3E]">
              @bhaama_veedhi 🤍
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#493B37] font-serif italic">
              &ldquo;{BRAND.quote}&rdquo;
            </p>
            <p className="mt-1 text-xs text-[#8B6C61]">
              Tag us in your everyday moments to get featured on our page.
            </p>
          </div>

          {/* Reel / Photo Grid Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {[
              {
                title: "Emerald Vine",
                img: "/products/necklace-vine.png",
              },
              {
                title: "Royal Chandbali",
                img: "/products/earrings-chandbali.png",
              },
              {
                title: "Kada Bangles",
                img: "/products/bangle-kada.png",
              },
              {
                title: "Solitaire Ring",
                img: "/products/ring-solitaire.png",
              },
            ].map((it, idx) => (
              <a
                key={idx}
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-xl border border-[#E8DAD5] bg-[#F8F3EE]"
              >
                <img
                  src={it.img}
                  alt={it.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-[#6B2C3E]/75 opacity-0 transition-opacity duration-300 flex items-center justify-center group-hover:opacity-100">
                  <div className="text-center text-white p-2">
                    <Instagram className="size-6 mx-auto mb-1" />
                    <span className="text-xs font-medium">View on Instagram</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xs bg-[#6B2C3E] px-8 py-3 text-xs uppercase tracking-widest font-semibold text-white hover:bg-[#85374E] shadow-sm transition-all"
          >
            <Instagram className="size-4" /> FOLLOW {BRAND.instagramHandle}
          </a>
        </div>
      </section>
    </>
  );
}
