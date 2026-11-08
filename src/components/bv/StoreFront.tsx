"use client";

/**
 * BHAAMA VEEDHI — Storefront
 * Exactly matched to user interface mockup:
 * 1. Hero Banner (left typography + right scalloped dish)
 * 2. ✦ Shop by Category ✦ (4 cards: Earrings, Necklaces, Bracelets, Chains)
 * 3. Product Catalog Grid (Category tabs, live search, quick view & cart)
 * 4. ✦ Our Happy Customers ✦ (3 customer review cards with circular avatars)
 * 5. ✦ Follow Us On Instagram ✦ (6 photo tiles)
 */
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Loader2,
  PackageOpen,
  Star,
  Instagram,
  ArrowRight,
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

  // 4 visual category cards matching mockup
  const categoryCards = [
    {
      name: "Earrings",
      label: "Earrings",
      image: "/brand/cat-earrings-photo.jpg",
    },
    {
      name: "Necklaces",
      label: "Necklaces",
      image: "/brand/cat-necklaces-photo.jpg",
    },
    {
      name: "Bracelets",
      label: "Bracelets",
      image: "/brand/cat-bracelets-photo.jpg",
    },
    {
      name: "Chains",
      label: "Chains",
      image: "/brand/cat-chains-photo.jpg",
    },
  ];

  // Instagram 6 photo tiles matching mockup
  const instagramPhotos = [
    { id: 1, src: "/brand/insta-1.jpg", alt: "Baby's breath florals on silk" },
    { id: 2, src: "/brand/insta-2.jpg", alt: "Gold floral clover pendant" },
    { id: 3, src: "/brand/insta-3.jpg", alt: "Deep velvety red roses" },
    { id: 4, src: "/brand/insta-4.jpg", alt: "Bow pearl earrings" },
    { id: 5, src: "/brand/insta-5.jpg", alt: "Baby's breath sprig bouquet" },
    { id: 6, src: "/brand/insta-6.jpg", alt: "Gold flower pendant in gift box" },
  ];

  // Customer reviews matching mockup
  const customerReviews = [
    {
      avatar: "/brand/customer-1.jpg",
      quote: "Absolutely loved the earrings! So elegant and lightweight ♡",
      author: "Ananya R.",
    },
    {
      avatar: "/brand/customer-2.jpg",
      quote: "Such a pretty collection. Will definitely shop again!",
      author: "Sneha M.",
    },
    {
      avatar: "/brand/customer-3.jpg",
      quote: "Minimal, classy and affordable. Just perfect! ♡",
      author: "Diya S.",
    },
  ];

  // Derive distinct categories from current catalog
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return ["All", "Earrings", "Necklaces", "Bracelets", "Chains", ...Array.from(set).filter(
      (c) => !["all", "earrings", "necklaces", "bracelets", "chains"].includes(c.toLowerCase())
    )];
  }, [products]);

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
        p.category.trim().toLowerCase().includes(activeCategory.trim().toLowerCase()) ||
        activeCategory.trim().toLowerCase().includes(p.category.trim().toLowerCase());

      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const selectCategoryAndScroll = (categoryName: string) => {
    setCategory(categoryName);
    setTimeout(() => {
      document.getElementById("collection")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Shop by Category Section */}
      <section id="categories" className="bg-[#FAF6F0] py-14 sm:py-16 border-b border-[#E8DAD5]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Heading with horizontal rules */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-10">
            <span className="hidden sm:block h-px w-24 sm:w-36 md:w-52 bg-[#D6B98C]/60" />
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#592534] flex items-center gap-2.5">
              <span className="text-[#D6B98C] text-sm sm:text-base">✦</span>
              Shop by Category
              <span className="text-[#D6B98C] text-sm sm:text-base">✦</span>
            </h2>
            <span className="hidden sm:block h-px w-24 sm:w-36 md:w-52 bg-[#D6B98C]/60" />
          </div>

          {/* 4 Category Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categoryCards.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => selectCategoryAndScroll(cat.name)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-[#E5D7CE] bg-white shadow-xs transition-all hover:shadow-md hover:border-[#D6B98C] flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#FAF6F0] rounded-t-2xl">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="h-full w-full object-cover transition-transform duration-600 ease-out group-hover:scale-106"
                  />
                </div>
                <div className="py-3.5 px-3 text-center bg-white border-t border-[#E8DAD5]/40">
                  <h3 className="font-serif text-base sm:text-lg font-medium text-[#592534] group-hover:text-[#6B2C3E] transition-colors">
                    {cat.label}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Product Catalog / Collection Grid */}
      <section id="collection" className="bg-[#FAF6F0] py-14 sm:py-16 border-b border-[#E8DAD5]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#592534]">
              {activeCategory === "All" ? "Featured Collection" : `${activeCategory} Collection`}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-[#8B6C61]">
              Everyday elegance handcrafted with care. Styled for Every Bhaama.
            </p>
          </div>

          {/* Dynamic Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded-full px-5 py-1.5 text-xs sm:text-sm font-medium transition-all tracking-wide",
                  activeCategory.trim().toLowerCase() === cat.trim().toLowerCase()
                    ? "bg-[#6B2C3E] text-white shadow-xs"
                    : "border border-[#E5D7CE] bg-white text-[#30272A]/85 hover:border-[#D6B98C] hover:text-[#6B2C3E]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Search Filter Banner */}
          {searchQuery && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-[#D6B98C] bg-white px-4 py-2.5 text-xs sm:text-sm text-[#30272A] shadow-xs">
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
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-[#8B6C61]">
              <Loader2 className="size-8 animate-spin text-[#6B2C3E]" />
              <p className="text-xs sm:text-sm font-medium">Unveiling our collection…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center bg-white rounded-2xl border border-[#E5D7CE] p-8">
              <PackageOpen className="size-9 text-[#8B6C61]" />
              <p className="font-serif text-xl text-[#592534]">No pieces found in this category</p>
              <p className="text-xs text-[#8B6C61] max-w-sm">
                Try selecting &quot;All&quot; or clearing your search to explore the rest of the collection.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCategory("All");
                  setSearchQuery("");
                }}
                className="mt-2 rounded-full border-[#6B2C3E] text-[#6B2C3E] hover:bg-[#6B2C3E] hover:text-white"
              >
                View All Pieces
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Our Happy Customers */}
      <section id="reviews" className="bg-[#FAF6F0] py-14 sm:py-16 border-b border-[#E8DAD5]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Heading with horizontal rules */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-10">
            <span className="hidden sm:block h-px w-24 sm:w-36 md:w-52 bg-[#D6B98C]/60" />
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#592534] flex items-center gap-2.5">
              <span className="text-[#D6B98C] text-sm sm:text-base">✦</span>
              Our Happy Customers
              <span className="text-[#D6B98C] text-sm sm:text-base">✦</span>
            </h2>
            <span className="hidden sm:block h-px w-24 sm:w-36 md:w-52 bg-[#D6B98C]/60" />
          </div>

          {/* 3 Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {customerReviews.map((rev, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-[#E5D7CE] bg-[#FAF6F0]/80 p-5 shadow-xs transition-all hover:bg-white hover:shadow-sm"
              >
                {/* Circular Avatar */}
                <div className="size-14 shrink-0 overflow-hidden rounded-full border border-[#D6B98C]/40 bg-white">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Stars + Quote + Author */}
                <div className="flex-1">
                  <div className="flex gap-1 text-[#6B2C3E] text-xs mb-1.5">
                    {[...Array(5)].map((_, idx) => (
                      <span key={idx}>★</span>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#493B37] leading-snug">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-[#6B2C3E]">
                    - {rev.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Follow Us On Instagram */}
      <section className="bg-[#FAF6F0] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Heading with horizontal rules */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-10">
            <span className="hidden sm:block h-px w-24 sm:w-36 md:w-52 bg-[#D6B98C]/60" />
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#592534] flex items-center gap-2.5">
              <span className="text-[#D6B98C] text-sm sm:text-base">✦</span>
              Follow Us On Instagram
              <span className="text-[#D6B98C] text-sm sm:text-base">✦</span>
            </h2>
            <span className="hidden sm:block h-px w-24 sm:w-36 md:w-52 bg-[#D6B98C]/60" />
          </div>

          {/* 6 Instagram Photo Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {instagramPhotos.map((item) => (
              <a
                key={item.id}
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-xl border border-[#E5D7CE] bg-white shadow-xs"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                />
                {/* Instagram hover overlay */}
                <div className="absolute inset-0 bg-[#6B2C3E]/75 opacity-0 transition-opacity duration-300 flex items-center justify-center group-hover:opacity-100">
                  <div className="text-center text-white p-2">
                    <Instagram className="size-5 mx-auto mb-1 text-[#D6B98C]" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">@bhaama_veedhi</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
