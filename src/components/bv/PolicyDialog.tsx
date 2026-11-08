"use client";

/**
 * BHAAMA VEEDHI — Official Policy Dialog
 * Displays Return & Refund Policy, Shipping & Delivery Policy, and Privacy Policy.
 * Matches brand aesthetic: Deep maroon (#6B2C3E), warm champagne (#FAF6F0), and antique gold (#D6B98C).
 */
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore, type PolicyTab } from "@/store/useStore";
import { BRAND } from "@/lib/format";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Video,
  Clock,
  AlertCircle,
  MessageCircle,
  CheckCircle2,
  PackageCheck,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PolicyDialog() {
  const policyModal = useStore((s) => s.policyModal);
  const closePolicy = useStore((s) => s.closePolicy);
  const [activeTab, setActiveTab] = useState<PolicyTab>("returns");

  useEffect(() => {
    if (policyModal) {
      setActiveTab(policyModal);
    }
  }, [policyModal]);

  return (
    <Dialog open={!!policyModal} onOpenChange={(o) => !o && closePolicy()}>
      <DialogContent className="max-w-3xl overflow-hidden bg-[#FAF6F0] p-0 sm:rounded-2xl border-[#D6B98C]/40 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <DialogHeader className="border-b border-[#D6B98C]/30 bg-white/80 px-6 pt-6 pb-4 text-left">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#8B6C61] font-medium">
            <span>BHAAMA VEEDHI</span>
            <span className="text-[#D6B98C]">✦</span>
            <span>Customer Care</span>
          </div>
          <DialogTitle className="font-serif text-2xl sm:text-3xl font-normal text-[#6B2C3E] mt-1">
            Store Policies & Guidelines
          </DialogTitle>

          {/* Tab Bar */}
          <div className="mt-4 flex flex-wrap gap-2 pt-1 border-t border-[#D6B98C]/20">
            <button
              onClick={() => setActiveTab("returns")}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all",
                activeTab === "returns"
                  ? "bg-[#6B2C3E] text-white shadow-sm"
                  : "bg-white text-[#493B37] hover:bg-[#E8DAD5]/50 border border-[#D6B98C]/30"
              )}
            >
              <RotateCcw className="size-3.5" />
              Return & Refund Policy
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all",
                activeTab === "shipping"
                  ? "bg-[#6B2C3E] text-white shadow-sm"
                  : "bg-white text-[#493B37] hover:bg-[#E8DAD5]/50 border border-[#D6B98C]/30"
              )}
            >
              <Truck className="size-3.5" />
              Shipping & Delivery Policy
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all",
                activeTab === "privacy"
                  ? "bg-[#6B2C3E] text-white shadow-sm"
                  : "bg-white text-[#493B37] hover:bg-[#E8DAD5]/50 border border-[#D6B98C]/30"
              )}
            >
              <ShieldCheck className="size-3.5" />
              Privacy Policy
            </button>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <ScrollArea className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-170px)]">
          {activeTab === "returns" && <ReturnRefundPolicyView />}
          {activeTab === "shipping" && <ShippingDeliveryPolicyView />}
          {activeTab === "privacy" && <PrivacyPolicyView />}
        </ScrollArea>

        {/* Footer WhatsApp Help Bar */}
        <div className="border-t border-[#D6B98C]/30 bg-white/90 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8B6C61]">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>Have questions or need assistance with your parcel?</span>
          </div>
          <a
            href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
              "Hi Bhaama Veedhi! I have a question regarding returns or shipping."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#6B2C3E] px-4 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-[#52212f] transition-colors"
          >
            <MessageCircle className="size-3.5 text-[#D6B98C]" />
            Chat on WhatsApp
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 1. Return & Refund Policy
 */
function ReturnRefundPolicyView() {
  return (
    <div className="space-y-6 text-[#30272A] font-sans leading-relaxed text-sm">
      {/* Policy Heading & Meta */}
      <div className="rounded-xl border border-[#D6B98C]/30 bg-white/80 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8DAD5] pb-3 mb-3">
          <h3 className="font-serif text-xl sm:text-2xl text-[#6B2C3E] font-medium">
            Return & Refund Policy
          </h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF6F0] px-3 py-1 text-xs text-[#8B6C61] border border-[#D6B98C]/30">
            <Clock className="size-3" /> Last updated: 8 November 2026
          </span>
        </div>
        <p className="text-[#493B37] text-sm leading-relaxed">
          At <strong>Bhaama Veedhi</strong>, we want you to love every purchase. Please read our return and refund policy before placing an order.
        </p>
      </div>

      {/* 1. Return Eligibility */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-[#6B2C3E] text-xs font-semibold text-white">
            1
          </span>
          <h4 className="font-serif text-lg font-semibold text-[#6B2C3E]">
            Return Eligibility
          </h4>
        </div>
        <p className="text-[#493B37] pl-8">
          We accept return or exchange requests in the following situations:
        </p>
        <ul className="pl-8 space-y-1.5">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 mt-0.5 shrink-0" />
            <span>You received a damaged or defective product.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 mt-0.5 shrink-0" />
            <span>You received an incorrect product.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 mt-0.5 shrink-0" />
            <span>The product received does not match its description.</span>
          </li>
        </ul>
        <div className="ml-8 mt-2 inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3.5 py-2 text-xs font-medium text-amber-900">
          <Clock className="size-4 text-amber-700 shrink-0" />
          <span>Please report the issue within <strong>48 hours of delivery</strong>.</span>
        </div>
      </div>

      {/* 2. 360° Unboxing Video Requirement (Featured Card) */}
      <div className="rounded-xl border-2 border-[#D6B98C] bg-gradient-to-br from-[#FFFDF9] to-[#FAF4EC] p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-full bg-[#6B2C3E] text-white">
            <Video className="size-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8B6C61]">
              Verification Requirement
            </span>
            <h4 className="font-serif text-lg font-semibold text-[#6B2C3E]">
              2. 360° Unboxing Video Requirement
            </h4>
          </div>
        </div>

        <p className="text-[#493B37] text-sm">
          To help us verify damaged, missing or incorrect products, customers are requested to record a <strong>clear, continuous 360° unboxing video</strong> while opening their parcel.
        </p>

        <div className="space-y-2 rounded-lg bg-white/90 p-4 border border-[#D6B98C]/30">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6B2C3E]">
            The video should follow these steps:
          </p>
          <ol className="space-y-2 text-xs sm:text-sm text-[#493B37]">
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#6B2C3E]">1.</span>
              <span>Start recording before opening the parcel.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#6B2C3E]">2.</span>
              <span>Show all sides of the unopened package (360°).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#6B2C3E]">3.</span>
              <span>Clearly show the shipping label.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#6B2C3E]">4.</span>
              <span>Open the parcel while recording.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#6B2C3E]">5.</span>
              <span>Show the product and packaging clearly from all angles.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#6B2C3E]">6.</span>
              <span>Ensure the video is continuous, without cuts, pauses or editing.</span>
            </li>
          </ol>
        </div>

        <div className="rounded-lg bg-[#FAF2EB] p-4 border border-[#E8DAD5] space-y-2 text-xs sm:text-sm">
          <p className="font-semibold text-[#6B2C3E] uppercase tracking-wide text-xs">
            Important:
          </p>
          <ul className="space-y-1.5 text-[#493B37]">
            <li className="flex items-start gap-2">
              <span className="text-[#6B2C3E] font-bold">•</span>
              <span>Share the video along with your order ID through our official WhatsApp or email.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#6B2C3E] font-bold">•</span>
              <span>Report any issue within <strong>48 hours of delivery</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#6B2C3E] font-bold">•</span>
              <span>Our team will review the request and guide you through the next steps.</span>
            </li>
          </ul>
          <p className="mt-3 text-xs italic text-[#70564D] border-t border-[#E8DAD5] pt-2">
            If you are unable to provide a video, please still contact us. We will assess your concern individually and in accordance with applicable consumer rights.
          </p>
        </div>
      </div>

      {/* 3. Items Not Eligible for Return */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-[#6B2C3E] text-xs font-semibold text-white">
            3
          </span>
          <h4 className="font-serif text-lg font-semibold text-[#6B2C3E]">
            Items Not Eligible for Return
          </h4>
        </div>
        <p className="text-[#493B37] pl-8">
          For hygiene reasons, we generally do not accept returns for:
        </p>
        <ul className="pl-8 space-y-1.5 text-[#493B37]">
          <li className="flex items-start gap-2">
            <XCircle className="size-4 text-rose-600 mt-0.5 shrink-0" />
            <span>Earrings and other pierced jewellery due to a change of mind.</span>
          </li>
          <li className="flex items-start gap-2">
            <XCircle className="size-4 text-rose-600 mt-0.5 shrink-0" />
            <span>Products damaged after delivery through improper handling.</span>
          </li>
          <li className="flex items-start gap-2">
            <XCircle className="size-4 text-rose-600 mt-0.5 shrink-0" />
            <span>Products showing signs of wear or use.</span>
          </li>
          <li className="flex items-start gap-2">
            <XCircle className="size-4 text-rose-600 mt-0.5 shrink-0" />
            <span>Products returned without original packaging where necessary for assessment.</span>
          </li>
        </ul>
        <p className="pl-8 text-xs text-[#70564D] italic">
          Change-of-mind returns are not ordinarily accepted. This does not affect your rights in cases of defective, incorrect or misdescribed products under applicable law.
        </p>
      </div>

      {/* 4. How to Request a Return */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-[#6B2C3E] text-xs font-semibold text-white">
            4
          </span>
          <h4 className="font-serif text-lg font-semibold text-[#6B2C3E]">
            How to Request a Return
          </h4>
        </div>
        <div className="ml-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="rounded-lg bg-white p-3.5 border border-[#D6B98C]/30 shadow-xs">
            <p className="font-semibold text-[#6B2C3E] mb-1">Step 1: Contact Us</p>
            <p className="text-[#493B37]">Reach out to us through official WhatsApp or email with your Order ID.</p>
          </div>
          <div className="rounded-lg bg-white p-3.5 border border-[#D6B98C]/30 shadow-xs">
            <p className="font-semibold text-[#6B2C3E] mb-1">Step 2: Share Visuals</p>
            <p className="text-[#493B37]">Share clear pictures of the product and attach the 360° unboxing video, if available.</p>
          </div>
          <div className="sm:col-span-2 rounded-lg bg-white p-3.5 border border-[#D6B98C]/30 shadow-xs">
            <p className="font-semibold text-[#6B2C3E] mb-1">Step 3: Verification & Next Steps</p>
            <p className="text-[#493B37]">Our team will review your request within 24–48 hours and provide detailed instructions for pickup, replacement or refund.</p>
          </div>
        </div>
      </div>

      {/* 5. Refund Process */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-[#6B2C3E] text-xs font-semibold text-white">
            5
          </span>
          <h4 className="font-serif text-lg font-semibold text-[#6B2C3E]">
            Refund Process
          </h4>
        </div>
        <ul className="pl-8 space-y-1.5 text-[#493B37]">
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>Approved refunds will be processed to the original payment method wherever possible.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>Refunds will generally be initiated within <strong>5–7 business days</strong> after approval.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>The time taken for the amount to reflect may depend on your bank or payment provider.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>Applicable delivery charges will also be addressed where the issue is attributable to us.</span>
          </li>
        </ul>
      </div>

      {/* 6. Exchanges */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-[#6B2C3E] text-xs font-semibold text-white">
            6
          </span>
          <h4 className="font-serif text-lg font-semibold text-[#6B2C3E]">
            Exchanges
          </h4>
        </div>
        <p className="text-[#493B37] pl-8">
          Exchanges may be offered for eligible damaged, defective or incorrectly delivered products, subject to availability.
        </p>
      </div>
    </div>
  );
}

/**
 * 2. Shipping & Delivery Policy
 */
function ShippingDeliveryPolicyView() {
  return (
    <div className="space-y-6 text-[#30272A] font-sans leading-relaxed text-sm">
      {/* Policy Heading & Meta */}
      <div className="rounded-xl border border-[#D6B98C]/30 bg-white/80 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8DAD5] pb-3 mb-3">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#6B2C3E] font-medium">
              Shipping & Delivery Policy
            </h3>
            <p className="text-xs text-[#8B6C61] uppercase tracking-wider mt-0.5">
              Shipping Policy – Bhaama Veedhi
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
            <Truck className="size-3.5" /> All India Delivery
          </span>
        </div>
        <p className="text-[#493B37] text-sm leading-relaxed">
          We aim to deliver your favourite jewellery safely and as quickly as possible.
        </p>
      </div>

      {/* Free Shipping Highlight Card */}
      <div className="rounded-xl border-2 border-[#D6B98C] bg-gradient-to-r from-[#FAF6F0] via-[#FFFDF9] to-[#FAF4EC] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8B6C61]">
            Special Offer
          </span>
          <h4 className="font-serif text-lg font-semibold text-[#6B2C3E]">
            Free Shipping on Orders Above ₹499
          </h4>
          <p className="text-xs text-[#493B37] mt-0.5">
            Standard shipping charges of ₹60 apply for orders below ₹499 (displayed at checkout before payment).
          </p>
        </div>
        <div className="shrink-0 rounded-full bg-[#6B2C3E] px-4 py-2 text-xs font-semibold text-white uppercase tracking-wider">
          Pan-India
        </div>
      </div>

      {/* Order Processing Time */}
      <div className="space-y-2 rounded-xl bg-white/80 p-5 border border-[#D6B98C]/30 shadow-xs">
        <div className="flex items-center gap-2">
          <Clock className="size-5 text-[#6B2C3E]" />
          <h4 className="font-serif text-lg font-semibold text-[#6B2C3E]">
            Order Processing Time
          </h4>
        </div>
        <ul className="space-y-2 text-[#493B37] pl-7">
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>Orders are usually processed and dispatched within <strong>3–4 business days</strong> after order confirmation.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>Orders placed on Sundays or public holidays may take additional processing time.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>You will receive an update once your order has been dispatched.</span>
          </li>
        </ul>
      </div>

      {/* Delivery Time */}
      <div className="space-y-2 rounded-xl bg-white/80 p-5 border border-[#D6B98C]/30 shadow-xs">
        <div className="flex items-center gap-2">
          <PackageCheck className="size-5 text-[#6B2C3E]" />
          <h4 className="font-serif text-lg font-semibold text-[#6B2C3E]">
            Delivery Time
          </h4>
        </div>
        <ul className="space-y-2 text-[#493B37] pl-7">
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>Delivery generally takes around <strong>5–10 business days</strong> after dispatch, depending on your location and courier service.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>Remote locations may require additional delivery time.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>Delivery estimates are indicative and may change due to courier delays, weather conditions or other circumstances beyond our control.</span>
          </li>
        </ul>
      </div>

      {/* Shipping Charges */}
      <div className="space-y-2 rounded-xl bg-white/80 p-5 border border-[#D6B98C]/30 shadow-xs">
        <div className="flex items-center gap-2">
          <Truck className="size-5 text-[#6B2C3E]" />
          <h4 className="font-serif text-lg font-semibold text-[#6B2C3E]">
            Shipping Charges
          </h4>
        </div>
        <ul className="space-y-2 text-[#493B37] pl-7">
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span><strong>Free shipping</strong> on orders above ₹499.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>Shipping charges for orders below ₹499 will be displayed at checkout, before payment.</span>
          </li>
        </ul>
      </div>

      {/* Order Tracking */}
      <div className="space-y-2 rounded-xl bg-white/80 p-5 border border-[#D6B98C]/30 shadow-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-emerald-600" />
          <h4 className="font-serif text-lg font-semibold text-[#6B2C3E]">
            Order Tracking
          </h4>
        </div>
        <p className="text-[#493B37] pl-7">
          Once your order is shipped, we will share tracking details through your registered mobile number, email or WhatsApp, where available.
        </p>
      </div>
    </div>
  );
}

/**
 * 3. Privacy Policy
 */
function PrivacyPolicyView() {
  return (
    <div className="space-y-6 text-[#30272A] font-sans leading-relaxed text-sm">
      <div className="rounded-xl border border-[#D6B98C]/30 bg-white/80 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8DAD5] pb-3 mb-3">
          <h3 className="font-serif text-xl sm:text-2xl text-[#6B2C3E] font-medium">
            Privacy Policy
          </h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF6F0] px-3 py-1 text-xs text-[#8B6C61] border border-[#D6B98C]/30">
            <ShieldCheck className="size-3" /> Customer Data Protection
          </span>
        </div>
        <p className="text-[#493B37] text-sm leading-relaxed">
          At <strong>Bhaama Veedhi</strong>, your privacy and trust are of paramount importance to us. We are committed to safeguarding your personal information and handling it responsibly.
        </p>
      </div>

      <div className="space-y-4 rounded-xl bg-white/80 p-5 border border-[#D6B98C]/30 shadow-xs">
        <h4 className="font-serif text-lg font-semibold text-[#6B2C3E]">
          1. Information We Collect
        </h4>
        <p className="text-[#493B37]">
          We collect only the essential details required to process your order, deliver your jewellery, and provide customer support:
        </p>
        <ul className="space-y-1.5 pl-6 text-[#493B37]">
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>Name, phone number, and delivery address.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>Email address for order confirmations and tracking updates.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>WhatsApp communications for customer support and unboxing verification.</span>
          </li>
        </ul>
      </div>

      <div className="space-y-4 rounded-xl bg-white/80 p-5 border border-[#D6B98C]/30 shadow-xs">
        <h4 className="font-serif text-lg font-semibold text-[#6B2C3E]">
          2. How We Use & Protect Your Information
        </h4>
        <ul className="space-y-1.5 pl-6 text-[#493B37]">
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>To pack, dispatch, and track your orders safely to your doorstep.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>We never sell, rent, or trade your personal information to third parties.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#6B2C3E] font-bold">•</span>
            <span>Address details are shared solely with verified courier partners for delivery fulfillment.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
