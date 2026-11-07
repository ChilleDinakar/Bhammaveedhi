"use client";

/**
 * BHAAMA VEEDHI — Cart Drawer
 * Slide-out drawer from the right (built on shadcn Sheet).
 * Shows items, qty +/- controls, individual + total prices,
 * and the zero-cost "Checkout via WhatsApp" button.
 */
import { ShoppingBag, Trash2, Plus, Minus, MessageCircle, X } from "lucide-react";
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
        className="flex w-full flex-col gap-0 bg-cream p-0 sm:max-w-md border-gold/30"
      >
        {/* Header */}
        <SheetHeader className="border-b border-gold/20 px-5 py-4 text-left">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 font-serif text-maroon">
              <ShoppingBag className="size-5 text-gold-dark" />
              Your Collection
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={setOpen}
              className="size-8 rounded-full text-maroon hover:bg-accent"
            >
              <X className="size-4" />
            </Button>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-accent">
              <ShoppingBag className="size-9 text-gold-dark" />
            </div>
            <div>
              <p className="font-serif text-xl text-maroon">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Discover a little sparkle to add to your story ✨
              </p>
            </div>
            <Button
              onClick={setOpen}
              className="bg-maroon text-cream hover:bg-maroon-light"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <ScrollArea className="flex-1 scrollbar-elegant">
              <div className="flex flex-col gap-3 p-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 rounded-xl border border-gold/20 bg-white p-3 shadow-sm animate-fade-in"
                  >
                    <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-cream-deep">
                      { }
                      <img
                        src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : "/products/necklace-vine.png"}
                        alt={item.product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-semibold leading-snug text-maroon">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                          aria-label={`Remove ${item.product.title}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-sm font-semibold text-gold-dark">
                        {formatINR(item.product.currentPrice)}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        {/* Qty controls */}
                        <div className="flex items-center gap-1 rounded-full border border-gold/30 bg-cream p-0.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="flex size-7 items-center justify-center rounded-full text-maroon transition-colors hover:bg-maroon hover:text-cream"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="min-w-6 text-center text-sm font-semibold text-maroon">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="flex size-7 items-center justify-center rounded-full text-maroon transition-colors hover:bg-maroon hover:text-cream"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-maroon">
                          {formatINR(item.product.currentPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer with total + WhatsApp checkout */}
            <div className="border-t border-gold/20 bg-white px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-serif text-base text-maroon">Total</span>
                <span className="font-serif text-2xl font-bold text-gold-dark">
                  {formatINR(total)}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full gap-2 bg-[#25D366] text-white shadow-md transition-all hover:bg-[#1da851] hover:shadow-lg"
              >
                <MessageCircle className="size-5" />
                Checkout via WhatsApp
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                You&rsquo;ll be redirected to WhatsApp to confirm your order with
                our team.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
