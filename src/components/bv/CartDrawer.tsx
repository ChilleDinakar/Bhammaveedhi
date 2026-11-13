"use client";

/**
 * BHAAMA VEEDHI — Cart & Express WhatsApp Checkout
 * Multi-step checkout experience:
 * - Step 1: "Your Collection" — Item review, quantities, prices, free shipping progress
 * - Step 2: "Delivery Details" — Comprehensive Indian delivery address capture
 *   with 6-digit Pincode auto-lookup (City/District & State via India Post),
 *   Landmark prompt, 10-digit mobile validation, and LocalStorage address memory.
 * - WhatsApp Dispatch: Formats an organized, ready-to-dispatch order message.
 */
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Home,
  Briefcase,
  CheckCircle2,
  Loader2,
  Edit2,
  Phone,
  User,
  ShieldCheck,
  Building,
  Navigation,
} from "lucide-react";
import { useStore, selectCartTotal } from "@/store/useStore";
import {
  formatINR,
  buildWhatsAppCheckoutUrl,
  INDIAN_STATES,
  type DeliveryAddress,
} from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const SAVED_ADDRESS_KEY = "bhaama_veedhi_delivery_address";

export function CartDrawer() {
  const open = useStore((s) => s.cartOpen);
  const setOpen = useStore((s) => s.closeCart);
  const openPolicy = useStore((s) => s.openPolicy);
  const items = useStore((s) => s.items);
  const total = useStore(selectCartTotal);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const currentUser = useStore((s) => s.user);
  const { toast } = useToast();

  const step = useStore((s) => s.cartStep);
  const setStep = useStore((s) => s.setCartStep);
  const [savedAddress, setSavedAddress] = useState<DeliveryAddress | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [saveForFuture, setSaveForFuture] = useState(true);

  // Address form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [houseDetails, setHouseDetails] = useState("");
  const [streetArea, setStreetArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState<string>("Telangana");
  const [addressType, setAddressType] = useState<"Home" | "Work">("Home");

  // Pincode lookup state
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Reset step to cart when drawer closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => setStep("cart"), 300);
    }
  }, [open]);

  // Load saved address from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_ADDRESS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DeliveryAddress;
        if (parsed.fullName && parsed.phone && parsed.pincode) {
          setSavedAddress(parsed);
          fillFormFromAddress(parsed);
        }
      } else if (currentUser?.name) {
        setFullName(currentUser.name);
      }
    } catch {
      // Ignore storage errors
    }
  }, [currentUser]);

  const fillFormFromAddress = (addr: DeliveryAddress) => {
    setFullName(addr.fullName || "");
    setPhone(addr.phone || "");
    setAltPhone(addr.altPhone || "");
    setPincode(addr.pincode || "");
    setHouseDetails(addr.houseDetails || "");
    setStreetArea(addr.streetArea || "");
    setLandmark(addr.landmark || "");
    setCity(addr.city || "");
    setState(addr.state || "Telangana");
    setAddressType(addr.addressType || "Home");
  };

  // Indian Pincode Auto-Lookup (via server-cached API)
  const handlePincodeChange = async (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 6);
    setPincode(digits);
    if (formErrors.pincode) {
      setFormErrors((prev) => ({ ...prev, pincode: "" }));
    }

    if (digits.length === 6) {
      setPincodeLoading(true);
      setPincodeStatus(null);
      try {
        const res = await fetch(`/api/pincode/${digits}`);
        const data = await res.json();
        if (data.success) {
          if (data.district) setCity(data.district);
          if (data.state) {
            // Find matching state in INDIAN_STATES
            const matched = INDIAN_STATES.find(
              (s) => s.toLowerCase() === data.state.toLowerCase()
            );
            if (matched) setState(matched);
            else setState(data.state);
          }
          setPincodeStatus(
            `✓ ${data.district ? `${data.district}, ` : ""}${data.state}`
          );
        } else {
          setPincodeStatus("Pincode verified (enter city manually if needed)");
        }
      } catch {
        // Silently allow manual entry
        setPincodeStatus(null);
      } finally {
        setPincodeLoading(false);
      }
    } else {
      setPincodeStatus(null);
    }
  };

  // Phone input formatting (digits only)
  const handlePhoneChange = (val: string, setter: (v: string) => void, field: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    setter(digits);
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate address form
  const validateAddress = (): DeliveryAddress | null => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = "Please enter the recipient's full name";
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      errors.phone = "Please enter a valid 10-digit mobile number (starts with 6-9)";
    }

    if (altPhone) {
      const cleanAlt = altPhone.replace(/\D/g, "");
      if (cleanAlt.length !== 10) {
        errors.altPhone = "Alternate mobile must be 10 digits";
      }
    }

    if (!pincode || pincode.length !== 6) {
      errors.pincode = "Please enter a valid 6-digit postal pincode";
    }

    if (!houseDetails.trim() || houseDetails.trim().length < 2) {
      errors.houseDetails = "Please enter Flat / House No., Floor, Building Name";
    }

    if (!streetArea.trim() || streetArea.trim().length < 2) {
      errors.streetArea = "Please enter Street, Road, Colony or Area";
    }

    if (!city.trim()) {
      errors.city = "Please enter Town / City / District";
    }

    if (!state.trim()) {
      errors.state = "Please select State";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return null;
    }

    return {
      fullName: fullName.trim(),
      phone: cleanPhone,
      altPhone: altPhone.replace(/\D/g, "") || undefined,
      pincode: pincode.trim(),
      houseDetails: houseDetails.trim(),
      streetArea: streetArea.trim(),
      landmark: landmark.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      addressType,
    };
  };

  // Complete Order via WhatsApp
  const proceedToWhatsApp = (addr: DeliveryAddress) => {
    if (saveForFuture) {
      try {
        localStorage.setItem(SAVED_ADDRESS_KEY, JSON.stringify(addr));
        setSavedAddress(addr);
      } catch {
        // Storage fail ignored
      }
    }

    const url = buildWhatsAppCheckoutUrl(
      items.map((i) => ({
        title: i.product.title,
        quantity: i.quantity,
        price: i.product.currentPrice * i.quantity,
      })),
      total,
      addr
    );

    toast({
      title: "Opening WhatsApp with your order & address! ✨",
      description: "Please tap 'Send' on WhatsApp to confirm your order with Bhaama Veedhi.",
    });

    window.open(url, "_blank");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validated = validateAddress();
    if (!validated) {
      toast({
        title: "Please complete all required address fields",
        description: "A complete address ensures accurate courier delivery without delays.",
        variant: "destructive",
      });
      return;
    }
    proceedToWhatsApp(validated);
  };

  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && setOpen()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 bg-[#FAF6F0] p-0 sm:max-w-md border-l border-[#D6B98C]/30 shadow-2xl"
      >
        {/* Header */}
        <SheetHeader className="border-b border-[#D6B98C]/20 bg-white/80 backdrop-blur-sm px-5 py-4 pr-12 text-left">
          {step === "address" ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep("cart");
                  setIsEditingAddress(false);
                }}
                className="flex size-8 items-center justify-center rounded-full text-[#6B2C3E] hover:bg-[#E8DAD5]/40 transition-colors"
                aria-label="Back to Cart"
              >
                <ArrowLeft className="size-4" />
              </button>
              <div>
                <p className="text-[10px] uppercase font-semibold tracking-[0.2em] text-[#8B6C61]">
                  Step 2 of 2
                </p>
                <SheetTitle className="font-serif text-[#6B2C3E] text-lg sm:text-xl font-medium">
                  Delivery Address
                </SheetTitle>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-[0.2em] text-[#8B6C61]">
                Step 1 of 2
              </p>
              <SheetTitle className="flex items-center gap-2 font-serif text-[#6B2C3E] text-xl font-medium">
                <ShoppingBag className="size-5 text-[#6B2C3E]" />
                Your Collection ({totalItemsCount})
              </SheetTitle>
            </div>
          )}
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
              className="bg-[#6B2C3E] text-[#F8F3EE] hover:bg-[#552331] uppercase tracking-wider text-xs font-semibold px-6 py-2.5 rounded-full"
            >
              Continue Shopping
            </Button>
          </div>
        ) : step === "cart" ? (
          /* ============================================================ */
          /* STEP 1: CART ITEMS VIEW                                      */
          /* ============================================================ */
          <>
            {/* Free Shipping Progress */}
            <div className="border-b border-[#D6B98C]/20 bg-[#E8DAD5]/50 px-5 py-2.5 text-xs text-[#6B2C3E]">
              {total >= 499 ? (
                <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-700 shrink-0" />
                  <span>✨ You unlocked <strong>FREE shipping</strong> across India!</span>
                </span>
              ) : (
                <span>
                  Add <strong className="font-semibold text-[#6B2C3E]">{formatINR(499 - total)}</strong> more to unlock <strong>FREE shipping</strong>!
                </span>
              )}
            </div>

            {/* Items List */}
            <ScrollArea className="flex-1 scrollbar-elegant">
              <div className="flex flex-col gap-3 p-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 rounded-xl border border-[#D6B98C]/25 bg-white p-3 shadow-xs animate-fade-in"
                  >
                    <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-[#FAF6F0] border border-[#D6B98C]/20">
                      <img
                        src={
                          item.product.images && item.product.images.length > 0
                            ? item.product.images[0]
                            : "/products/necklace-vine.png"
                        }
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
                        <div className="flex items-center gap-1 rounded-full border border-[#D6B98C]/40 bg-[#FAF6F0] p-0.5">
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

            {/* Footer with total + Proceed button */}
            <div className="border-t border-[#D6B98C]/20 bg-white px-5 py-4">
              <div className="mb-1 flex items-center justify-between text-xs text-[#8B6C61]">
                <span>Shipping</span>
                <span>
                  {total >= 499 ? (
                    <strong className="text-emerald-700">FREE</strong>
                  ) : (
                    "₹60 (Standard)"
                  )}
                </span>
              </div>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-serif text-base text-[#6B2C3E]">
                  Estimated Total
                </span>
                <span className="font-serif text-2xl font-bold text-[#6B2C3E]">
                  {formatINR(total >= 499 ? total : total + 60)}
                </span>
              </div>

              {/* Proceed to Delivery Details */}
              <Button
                onClick={() => setStep("address")}
                size="lg"
                className="w-full gap-2 bg-[#6B2C3E] text-[#F8F3EE] hover:bg-[#552331] uppercase tracking-wider text-xs font-semibold py-3.5 rounded-full shadow-md transition-all hover:shadow-lg"
              >
                <span>Enter Delivery Details</span>
                <ArrowRight className="size-4" />
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
        ) : (
          /* ============================================================ */
          /* STEP 2: DELIVERY ADDRESS CAPTURE                             */
          /* ============================================================ */
          <>
            {/* Compact Order Pill */}
            <div className="border-b border-[#D6B98C]/20 bg-white/70 px-5 py-2.5 text-xs text-[#6B2C3E] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#493B37]">
                  {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"}
                </span>
                <span className="text-[#D6B98C]">•</span>
                <span className="text-emerald-700 font-medium">
                  {total >= 499 ? "Free Delivery" : "+₹60 Delivery"}
                </span>
              </div>
              <div className="font-serif font-bold text-base text-[#6B2C3E]">
                {formatINR(total >= 499 ? total : total + 60)}
              </div>
            </div>

            <ScrollArea className="flex-1 scrollbar-elegant">
              <div className="p-4 sm:p-5 space-y-4">
                {/* A. If saved address exists and not editing: show quick card */}
                {savedAddress && !isEditingAddress ? (
                  <div className="rounded-xl border-2 border-[#D6B98C] bg-white p-4 shadow-sm space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-[#E8DAD5] pb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-[#6B2C3E]" />
                        <span className="font-serif text-sm font-semibold text-[#6B2C3E]">
                          Deliver To Saved Address
                        </span>
                      </div>
                      <span className="rounded-full bg-[#FAF6F0] px-2.5 py-0.5 text-[10px] font-semibold text-[#8B6C61] border border-[#D6B98C]/30 uppercase">
                        {savedAddress.addressType}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs sm:text-sm text-[#493B37] leading-relaxed">
                      <p className="font-bold text-[#6B2C3E] text-sm">
                        {savedAddress.fullName}
                      </p>
                      <p>
                        {savedAddress.houseDetails}, {savedAddress.streetArea}
                      </p>
                      {savedAddress.landmark && (
                        <p className="text-[#8B6C61] italic">
                          Landmark: {savedAddress.landmark}
                        </p>
                      )}
                      <p className="font-medium text-[#30272A]">
                        {savedAddress.city}, {savedAddress.state} —{" "}
                        <strong className="text-[#6B2C3E]">
                          {savedAddress.pincode}
                        </strong>
                      </p>
                      <p className="pt-1 text-[#6B2C3E] font-medium flex items-center gap-1.5">
                        <Phone className="size-3 text-[#8B6C61]" />
                        +91 {savedAddress.phone}
                        {savedAddress.altPhone && ` (Alt: +91 ${savedAddress.altPhone})`}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <Button
                        onClick={() => proceedToWhatsApp(savedAddress)}
                        className="w-full gap-2 bg-[#6B2C3E] text-white hover:bg-[#552331] uppercase tracking-wider text-xs font-semibold py-3 rounded-full shadow-md transition-all"
                      >
                        <MessageCircle className="size-4 text-[#D6B98C]" />
                        Confirm & Order on WhatsApp
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingAddress(true)}
                        className="w-full gap-1.5 border-[#D6B98C] text-[#6B2C3E] hover:bg-[#FAF6F0] text-xs font-medium py-2 rounded-full"
                      >
                        <Edit2 className="size-3" />
                        Change / Edit Address
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* B. Address Form */
                  <form
                    onSubmit={handleFormSubmit}
                    className="rounded-xl border border-[#D6B98C]/30 bg-white p-4 sm:p-5 shadow-xs space-y-4 animate-fade-in"
                  >
                    <div className="flex items-center justify-between border-b border-[#E8DAD5] pb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-[#6B2C3E]" />
                        <h3 className="font-serif text-base font-semibold text-[#6B2C3E]">
                          {savedAddress ? "Edit Delivery Address" : "Shipping Address"}
                        </h3>
                      </div>
                      {savedAddress && (
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(false)}
                          className="text-xs text-[#8B6C61] hover:text-[#6B2C3E] underline"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    {/* Recipient Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#493B37] mb-1">
                        Full Name <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 size-4 text-[#8B6C61]" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (formErrors.fullName)
                              setFormErrors((prev) => ({ ...prev, fullName: "" }));
                          }}
                          placeholder="e.g. Ananya Sharma"
                          className={cn(
                            "w-full rounded-lg border bg-[#FAF6F0]/40 pl-9 pr-3 py-2 text-xs sm:text-sm text-[#30272A] placeholder:text-[#8B6C61]/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#6B2C3E]",
                            formErrors.fullName
                              ? "border-rose-400"
                              : "border-[#D6B98C]/40"
                          )}
                        />
                      </div>
                      {formErrors.fullName && (
                        <p className="mt-1 text-[11px] text-rose-600">
                          {formErrors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Mobile Number & Alternate Mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#493B37] mb-1">
                          Mobile Number <span className="text-rose-600">*</span>
                        </label>
                        <div className="flex rounded-lg border border-[#D6B98C]/40 bg-[#FAF6F0]/40 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#6B2C3E]">
                          <span className="flex items-center px-2.5 text-xs text-[#8B6C61] font-semibold border-r border-[#D6B98C]/30">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={phone}
                            onChange={(e) =>
                              handlePhoneChange(e.target.value, setPhone, "phone")
                            }
                            placeholder="10-digit number"
                            className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-[#30272A] placeholder:text-[#8B6C61]/60 focus:outline-none"
                          />
                        </div>
                        {formErrors.phone && (
                          <p className="mt-1 text-[11px] text-rose-600">
                            {formErrors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#493B37] mb-1">
                          Alternate Phone <span className="text-[10px] text-[#8B6C61] font-normal">(Optional)</span>
                        </label>
                        <div className="flex rounded-lg border border-[#D6B98C]/40 bg-[#FAF6F0]/40 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#6B2C3E]">
                          <span className="flex items-center px-2.5 text-xs text-[#8B6C61] font-semibold border-r border-[#D6B98C]/30">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={altPhone}
                            onChange={(e) =>
                              handlePhoneChange(e.target.value, setAltPhone, "altPhone")
                            }
                            placeholder="Alternate mobile"
                            className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-[#30272A] placeholder:text-[#8B6C61]/60 focus:outline-none"
                          />
                        </div>
                        {formErrors.altPhone && (
                          <p className="mt-1 text-[11px] text-rose-600">
                            {formErrors.altPhone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Pincode with Auto-Lookup */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[#493B37]">
                          Pincode <span className="text-rose-600">*</span>
                        </label>
                        {pincodeStatus && (
                          <span className="text-[11px] text-emerald-700 font-medium">
                            {pincodeStatus}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => handlePincodeChange(e.target.value)}
                          placeholder="6-digit Indian Pincode (e.g. 560038)"
                          className={cn(
                            "w-full rounded-lg border bg-[#FAF6F0]/40 px-3 py-2 text-xs sm:text-sm text-[#30272A] placeholder:text-[#8B6C61]/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#6B2C3E]",
                            formErrors.pincode
                              ? "border-rose-400"
                              : "border-[#D6B98C]/40"
                          )}
                        />
                        {pincodeLoading && (
                          <Loader2 className="absolute right-3 top-2.5 size-4 animate-spin text-[#6B2C3E]" />
                        )}
                      </div>
                      {formErrors.pincode && (
                        <p className="mt-1 text-[11px] text-rose-600">
                          {formErrors.pincode}
                        </p>
                      )}
                    </div>

                    {/* Flat, House No., Building Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#493B37] mb-1">
                        Flat, House No., Floor, Building Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={houseDetails}
                        onChange={(e) => {
                          setHouseDetails(e.target.value);
                          if (formErrors.houseDetails)
                            setFormErrors((prev) => ({ ...prev, houseDetails: "" }));
                        }}
                        placeholder="e.g. Flat 304, Sri Sai Residency"
                        className={cn(
                          "w-full rounded-lg border bg-[#FAF6F0]/40 px-3 py-2 text-xs sm:text-sm text-[#30272A] placeholder:text-[#8B6C61]/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#6B2C3E]",
                          formErrors.houseDetails
                            ? "border-rose-400"
                            : "border-[#D6B98C]/40"
                        )}
                      />
                      {formErrors.houseDetails && (
                        <p className="mt-1 text-[11px] text-rose-600">
                          {formErrors.houseDetails}
                        </p>
                      )}
                    </div>

                    {/* Street, Road, Colony, Area */}
                    <div>
                      <label className="block text-xs font-semibold text-[#493B37] mb-1">
                        Street Address, Road, Colony, Area <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={streetArea}
                        onChange={(e) => {
                          setStreetArea(e.target.value);
                          if (formErrors.streetArea)
                            setFormErrors((prev) => ({ ...prev, streetArea: "" }));
                        }}
                        placeholder="e.g. 12th Main Road, 4th Cross, Indiranagar"
                        className={cn(
                          "w-full rounded-lg border bg-[#FAF6F0]/40 px-3 py-2 text-xs sm:text-sm text-[#30272A] placeholder:text-[#8B6C61]/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#6B2C3E]",
                          formErrors.streetArea
                            ? "border-rose-400"
                            : "border-[#D6B98C]/40"
                        )}
                      />
                      {formErrors.streetArea && (
                        <p className="mt-1 text-[11px] text-rose-600">
                          {formErrors.streetArea}
                        </p>
                      )}
                    </div>

                    {/* Landmark (Courier Helper) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[#493B37]">
                          Landmark
                        </label>
                        <span className="text-[10px] text-[#8B6C61] italic">
                          Helps courier reach doorstep
                        </span>
                      </div>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near Apollo Pharmacy / Behind Ganesh Temple"
                        className="w-full rounded-lg border border-[#D6B98C]/40 bg-[#FAF6F0]/40 px-3 py-2 text-xs sm:text-sm text-[#30272A] placeholder:text-[#8B6C61]/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#6B2C3E]"
                      />
                    </div>

                    {/* City & State (Auto-filled / Dropdown) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#493B37] mb-1">
                          City / District <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => {
                            setCity(e.target.value);
                            if (formErrors.city)
                              setFormErrors((prev) => ({ ...prev, city: "" }));
                          }}
                          placeholder="e.g. Bengaluru"
                          className={cn(
                            "w-full rounded-lg border bg-[#FAF6F0]/40 px-3 py-2 text-xs sm:text-sm text-[#30272A] placeholder:text-[#8B6C61]/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#6B2C3E]",
                            formErrors.city
                              ? "border-rose-400"
                              : "border-[#D6B98C]/40"
                          )}
                        />
                        {formErrors.city && (
                          <p className="mt-1 text-[11px] text-rose-600">
                            {formErrors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#493B37] mb-1">
                          State <span className="text-rose-600">*</span>
                        </label>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full rounded-lg border border-[#D6B98C]/40 bg-white px-3 py-2 text-xs sm:text-sm text-[#30272A] focus:outline-none focus:ring-1 focus:ring-[#6B2C3E]"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Address Type Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-[#493B37] mb-1.5">
                        Address Type
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setAddressType("Home")}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium border transition-all",
                            addressType === "Home"
                              ? "bg-[#6B2C3E] text-white border-[#6B2C3E] shadow-xs"
                              : "bg-white text-[#493B37] border-[#D6B98C]/40 hover:bg-[#FAF6F0]"
                          )}
                        >
                          <Home className="size-3.5" />
                          <span>Home (All-day delivery)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAddressType("Work")}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium border transition-all",
                            addressType === "Work"
                              ? "bg-[#6B2C3E] text-white border-[#6B2C3E] shadow-xs"
                              : "bg-white text-[#493B37] border-[#D6B98C]/40 hover:bg-[#FAF6F0]"
                          )}
                        >
                          <Briefcase className="size-3.5" />
                          <span>Work (10 AM – 6 PM)</span>
                        </button>
                      </div>
                    </div>

                    {/* Save address checkbox */}
                    <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-[#493B37]">
                      <input
                        type="checkbox"
                        checked={saveForFuture}
                        onChange={(e) => setSaveForFuture(e.target.checked)}
                        className="size-4 rounded text-[#6B2C3E] focus:ring-[#6B2C3E]"
                      />
                      <span>Save this address for fast 1-click future orders</span>
                    </label>

                    {/* Action button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full gap-2 bg-[#6B2C3E] text-white hover:bg-[#552331] uppercase tracking-wider text-xs font-semibold py-3.5 rounded-full shadow-md transition-all hover:shadow-lg"
                      >
                        <MessageCircle className="size-4 text-[#D6B98C]" />
                        Confirm & Place Order on WhatsApp
                      </Button>
                    </div>
                  </form>
                )}

                {/* Assurance Trust Note */}
                <div className="rounded-xl bg-[#FAF2EB] p-3.5 border border-[#E8DAD5] flex items-start gap-2.5 text-xs text-[#70564D]">
                  <ShieldCheck className="size-4 text-[#6B2C3E] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Your address will be shared directly with Bhaama Veedhi on WhatsApp to arrange safe insured dispatch with tracking details.
                  </p>
                </div>
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
