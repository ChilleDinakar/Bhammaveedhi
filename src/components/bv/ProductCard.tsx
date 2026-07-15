"use client";

/**
 * BHAAMA VEEDHI — Product Card
 * Image (subtle zoom on hover) · Title · Price (gold current, gray strikethrough
 * for previous) · "Add to Cart" button. Cinematic fade-in on mount.
 */
import { ShoppingBag, Eye } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/store/useStore";
import { useStore } from "@/store/useStore";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addToCart = useStore((s) => s.addToCart);
  const openQuickView = useStore((s) => s.openQuickView);
  const { toast } = useToast();

  const discount = product.previousPrice
    ? Math.round(
        ((product.previousPrice - product.currentPrice) / product.previousPrice) *
          100
      )
    : 0;

  const handleAdd = () => {
    addToCart(product, 1);
    toast({
      title: "Added to cart ✨",
      description: product.title,
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.07, 0.5), ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gold/25 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gold/50"
    >
      {/* Image */}
      <button
        onClick={() => openQuickView(product)}
        className="relative aspect-square overflow-hidden bg-cream-deep"
        aria-label={`View ${product.title}`}
      >
        { }
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <Badge className="bg-maroon text-cream shadow hover:bg-maroon">
              -{discount}%
            </Badge>
          )}
          {!product.inStock && (
            <Badge className="bg-muted text-muted-foreground shadow hover:bg-muted">
              Sold out
            </Badge>
          )}
          {product.images.length > 1 && (
            <Badge className="bg-gold/90 text-white shadow hover:bg-gold">
              +{product.images.length - 1} photos
            </Badge>
          )}
        </div>

        {/* Quick view hint */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-maroon/90 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
          <span className="flex items-center gap-1.5 text-sm font-medium text-cream">
            <Eye className="size-4" /> Quick view
          </span>
        </div>
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] uppercase tracking-[0.15em] text-gold-dark">
          {product.category}
        </span>
        <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-maroon">
          {product.title}
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-xl font-bold text-gold-dark">
            {formatINR(product.currentPrice)}
          </span>
          {product.previousPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatINR(product.previousPrice)}
            </span>
          )}
        </div>

        <Button
          onClick={handleAdd}
          disabled={!product.inStock}
          className="mt-4 w-full gap-2 bg-maroon text-cream transition-all hover:bg-maroon-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingBag className="size-4" />
          {product.inStock ? "Add to Cart" : "Sold Out"}
        </Button>
      </div>
    </motion.article>
  );
}
