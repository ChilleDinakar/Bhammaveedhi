"use client";

/**
 * BHAAMA VEEDHI — Cart Drawer
 * Slide-out drawer from the right (built on shadcn Sheet).
 * Shows items, qty +/- controls, individual + total prices,
 * and the zero-cost "Checkout via WhatsApp" button.
 */
import { ShoppingBag, Trash2, Plus, Minus, MessageCircle } from "lucide-react";
import { useStore, selectCartTotal } from "@/store/useStore";
import { formatINR, buildWhatsAppCheckoutUrl } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

export function CartDrawer() {
  const open = useStore((s) => s.cartOpen);
  const setOpen = useStore((s) => s.closeCart);
  const openPolicy = useStore((s) => s.openPolicy);
  const items = useStore((s) => s.items);
  const total = useStore(selectCartTotal);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const { toast } = useToast();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Add a little sparkle before checking out ✨",
        variant: "destructive",
      });
      return;
    }
    const url = buildWhatsAppCheckoutUrl(
      items.map((i) => ({
        title: i.product.title,
        quantity: i.quantity,
        price: i.product.currentPrice * i.quantity,
      })),
      total
    );
    window.open(url, "_blank");
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && setOpen()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 bg-[#F8F3EE] p-0 sm:max-w-md border-l border-[#D6B98C]/30 shadow-2xl"
      >
        {/* Header */}
        <SheetHeader className="border-b border-[#D6B98C]/20 bg-white/70 backdrop-blur-sm px-5 py-4 pr-12 text-left">
          <SheetTitle className="flex items-center gap-2 font-serif text-[#6B2C3E] text-xl">
            <ShoppingBag className="size-5 text-[#6B2C3E]" />
            Your Collection ({items.reduce((acc, i) => acc + i.quantity, 0)})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-[#E8DAD5]/40 text-[#6B2C3E]">
              <ShoppingBag className="size-9" />
            </div>
            <div>
              <p className="font-serif text-2xl text-[#6B2C3E]">Your cart is empty</p>
              <p className="mt-1 text-sm text-[#8B6C61]">
                Discover a little sparkle to add to your story ✨
              </p>
            </div>
            <Button
              onClick={setOpen}
              className="bg-[#6B2C3E] text-[#F8F3EE] hover:bg-[#552331] uppercase tracking-wider text-xs font-semibold px-6 py-2.5"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Free Shipping Progress */}
            <div className="border-b border-[#D6B98C]/20 bg-[#E8DAD5]/50 px-5 py-2.5 text-xs text-[#6B2C3E]">
              {total >= 499 ? (
                <span className="font-semibold text-emerald-800">
                  ✨ Congratulations! You unlocked FREE shipping across India!
                </span>
              ) : (
                <span>
                  Add <strong className="font-semibold text-[#6B2C3E]">{formatINR(499 - total)}</strong> more to get <strong>FREE shipping</strong>!
                </span>
              )}
            </div>

            {/* Items */}
            <ScrollArea className="flex-1 scrollbar-elegant">
              <div className="flex flex-col gap-3 p-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 rounded-xl border border-[#D6B98C]/20 bg-white p-3 shadow-sm animate-fade-in"
                  >
                    <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-[#F8F3EE]">
                      <img
                        src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : "/products/necklace-vine.png"}
                        alt={item.product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-semibold leading-snug text-[#6B2C3E]">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#8B6C61] transition-colors hover:text-rose-600"
                          aria-label={`Remove ${item.product.title}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-sm font-semibold text-[#6B2C3E]">
                        {formatINR(item.product.currentPrice)}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        {/* Qty controls */}
                        <div className="flex items-center gap-1 rounded-full border border-[#D6B98C]/40 bg-[#F8F3EE] p-0.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="flex size-7 items-center justify-center rounded-full text-[#6B2C3E] transition-colors hover:bg-[#6B2C3E] hover:text-[#F8F3EE]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="min-w-6 text-center text-sm font-semibold text-[#6B2C3E]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="flex size-7 items-center justify-center rounded-full text-[#6B2C3E] transition-colors hover:bg-[#6B2C3E] hover:text-[#F8F3EE]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-[#6B2C3E]">
                          {formatINR(item.product.currentPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer with total + WhatsApp checkout */}
            <div className="border-t border-[#D6B98C]/20 bg-white px-5 py-4">
              <div className="mb-1 flex items-center justify-between text-xs text-[#8B6C61]">
                <span>Shipping</span>
                <span>{total >= 499 ? <strong className="text-emerald-700">FREE</strong> : "₹60 (Standard)"}</span>
              </div>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-serif text-base text-[#6B2C3E]">Estimated Total</span>
                <span className="font-serif text-2xl font-bold text-[#6B2C3E]">
                  {formatINR(total >= 499 ? total : total + 60)}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full gap-2 bg-[#6B2C3E] text-[#F8F3EE] hover:bg-[#552331] uppercase tracking-wider text-xs font-semibold py-3 shadow-md transition-all hover:shadow-lg"
              >
                <MessageCircle className="size-4 text-[#D6B98C]" />
                Checkout via WhatsApp
              </Button>
              <p className="mt-2 text-center text-[11px] text-[#8B6C61]">
                Dispatches in 3–4 business days across India ♡
              </p>
              <div className="mt-1.5 flex items-center justify-center gap-3 text-[10px] text-[#8B6C61]/80">
                <button
                  type="button"
                  onClick={() => openPolicy("shipping")}
                  className="underline underline-offset-2 hover:text-[#6B2C3E] transition-colors"
                >
                  Shipping Policy
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => openPolicy("returns")}
                  className="underline underline-offset-2 hover:text-[#6B2C3E] transition-colors"
                >
                  Return Policy
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
