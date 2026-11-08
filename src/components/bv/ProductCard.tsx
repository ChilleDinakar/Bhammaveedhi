"use client";

/**
 * BHAAMA VEEDHI — Product Card
 * Brand Direction: Minimal Luxury
 * - Background: Pure White (#FFFFFF)
 * - Typography: Poppins Medium title, Poppins SemiBold Price
 * - Sale labels: Dusty Blush (#E8DAD5)
 * - Button: Solid Maroon (#6B2C3E) with shopping bag icon
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[#E8DAD5] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#D6B98C]"
    >
      {/* Image Container with Zoom */}
      <button
        onClick={() => openQuickView(product)}
        className="relative aspect-square overflow-hidden bg-[#F8F3EE]/60"
        aria-label={`View ${product.title}`}
      >
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : "/products/necklace-vine.png"}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <Badge className="bg-[#E8DAD5] text-[#6B2C3E] border-none font-medium px-2 py-0.5 text-[11px] shadow-sm">
              -{discount}% OFF
            </Badge>
          )}
          {!product.inStock && (
            <Badge className="bg-[#493B37] text-white border-none text-[10px] uppercase tracking-wider">
              Sold out
            </Badge>
          )}
        </div>

        {/* Photo count indicator */}
        {product.images && product.images.length > 1 && (
          <span className="absolute right-2.5 bottom-2.5 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
            +{product.images.length - 1} photos
          </span>
        )}

        {/* Hover Quick view banner */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-1.5 bg-[#6B2C3E]/90 py-2.5 text-xs font-medium text-white transition-transform duration-300 group-hover:translate-y-0">
          <Eye className="size-3.5" /> Quick View
        </div>
      </button>

      {/* Card Details */}
      <div className="flex flex-1 flex-col p-4 justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#8B6C61]">
            {product.category}
          </span>
          <h3
            onClick={() => openQuickView(product)}
            className="mt-1 font-sans text-sm sm:text-base font-medium leading-snug text-[#30272A] hover:text-[#6B2C3E] cursor-pointer transition-colors line-clamp-1"
          >
            {product.title}
          </h3>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-semibold text-[#6B2C3E]">
              {formatINR(product.currentPrice)}
            </span>
            {product.previousPrice && (
              <span className="text-xs text-[#8B6C61] line-through">
                {formatINR(product.previousPrice)}
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={handleAdd}
          disabled={!product.inStock}
          size="sm"
          className="mt-4 w-full gap-2 bg-[#6B2C3E] text-white transition-all hover:bg-[#85374E] disabled:cursor-not-allowed disabled:opacity-50 text-xs font-medium uppercase tracking-wider rounded-sm py-2"
        >
          <ShoppingBag className="size-3.5" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </motion.article>
  );
}
