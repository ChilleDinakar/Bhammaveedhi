"use client";

/**
 * BHAAMA VEEDHI — Quick View Dialog
 * Modal showing full product details + quantity selector + add to cart.
 *
 * Now supports MULTIPLE images per product: a main image with a thumbnail
 * strip beneath it. Clicking a thumbnail swaps the main image. The inner
 * component is keyed by product id so the selected image + quantity reset
 * cleanly when switching products (no setState-in-effect needed).
 */
import { useState } from "react";
import { ShoppingBag, Minus, Plus, Check } from "lucide-react";
import { useStore, type Product } from "@/store/useStore";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function QuickViewDialog() {
  const product = useStore((s) => s.quickViewProduct);
  const close = useStore((s) => s.closeQuickView);

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-3xl overflow-hidden bg-cream p-0 sm:rounded-2xl border-gold/30">
        {product && <QuickViewContent key={product.id} product={product} />}
      </DialogContent>
    </Dialog>
  );
}

function QuickViewContent({ product }: { product: Product }) {
  const close = useStore((s) => s.closeQuickView);
  const addToCart = useStore((s) => s.addToCart);
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const images = product.images.length > 0 ? product.images : ["/products/necklace-vine.png"];
  const discount = product.previousPrice
    ? Math.round(
        ((product.previousPrice - product.currentPrice) / product.previousPrice) *
          100
      )
    : 0;

  const handleAdd = () => {
    addToCart(product, qty);
    toast({
      title: "Added to cart ✨",
      description: `${qty} × ${product.title}`,
    });
    close();
  };

  return (
    <div className="grid gap-0 md:grid-cols-2">
      {/* Image gallery */}
      <div className="relative flex flex-col bg-cream-deep">
        <div className="relative aspect-square overflow-hidden">
          { }
          <img
            src={images[activeImg]}
            alt={`${product.title} — view ${activeImg + 1}`}
            className="h-full w-full object-cover"
          />
          {discount > 0 && (
            <Badge className="absolute left-4 top-4 bg-maroon text-cream">
              -{discount}% Off
            </Badge>
          )}
          {images.length > 1 && (
            <span className="absolute bottom-4 right-4 rounded-full bg-maroon/80 px-2.5 py-1 text-xs font-medium text-cream backdrop-blur-sm">
              {activeImg + 1} / {images.length}
            </span>
          )}
        </div>

        {/* Thumbnail strip (only when multiple images) */}
        {images.length > 1 && (
          <div className="flex gap-2 p-3">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  "relative size-14 shrink-0 overflow-hidden rounded-md border-2 transition-all",
                  i === activeImg
                    ? "border-gold ring-2 ring-gold/30"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                { }
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col p-6 sm:p-8">
        <DialogHeader>
          <span className="text-[11px] uppercase tracking-[0.15em] text-gold-dark">
            {product.category}
          </span>
          <DialogTitle className="font-serif text-2xl font-bold text-maroon sm:text-3xl">
            {product.title}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-serif text-3xl font-bold text-gold-dark">
            {formatINR(product.currentPrice)}
          </span>
          {product.previousPrice && (
            <span className="text-base text-muted-foreground line-through">
              {formatINR(product.previousPrice)}
            </span>
          )}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-foreground/75">
          {product.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm">
          {product.inStock ? (
            <span className="flex items-center gap-1.5 font-medium text-green-700">
              <Check className="size-4" /> In stock
            </span>
          ) : (
            <span className="font-medium text-destructive">Sold out</span>
          )}
        </div>

        {/* Quantity */}
        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm font-medium text-maroon">Quantity</span>
          <div className="flex items-center gap-1 rounded-full border border-gold/30 bg-white p-0.5">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex size-8 items-center justify-center rounded-full text-maroon transition-colors hover:bg-maroon hover:text-cream"
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </button>
            <span className="min-w-8 text-center font-semibold text-maroon">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="flex size-8 items-center justify-center rounded-full text-maroon transition-colors hover:bg-maroon hover:text-cream"
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <Button
          onClick={handleAdd}
          disabled={!product.inStock}
          size="lg"
          className="mt-6 w-full gap-2 bg-maroon text-cream hover:bg-maroon-light disabled:opacity-50"
        >
          <ShoppingBag className="size-4" />
          {product.inStock ? "Add to Cart" : "Sold Out"}
        </Button>
      </div>
    </div>
  );
}
