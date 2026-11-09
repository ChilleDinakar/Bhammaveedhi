import Link from "next/link";
import { Navbar } from "@/components/bv/Navbar";
import { Footer } from "@/components/bv/Footer";
import { CartDrawer } from "@/components/bv/CartDrawer";
import { PolicyDialog } from "@/components/bv/PolicyDialog";
import { ArrowLeft, Clock, Video, CheckCircle2, XCircle, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/format";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Refund Policy — Bhaama Veedhi",
  description: "Official Return & Refund Policy for Bhaama Veedhi. Learn about return eligibility, 360° unboxing video requirement, and refund process.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF6F0]">
      <Navbar />

      <main className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Breadcrumb / Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#8B6C61] hover:text-[#6B2C3E] transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="size-3.5" /> Back to Store
        </Link>

        {/* Header */}
        <div className="rounded-2xl border border-[#D6B98C]/40 bg-white/90 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8DAD5] pb-4 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#8B6C61] font-semibold">
                BHAAMA VEEDHI
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#6B2C3E] font-normal mt-1">
                Return & Refund Policy
              </h1>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF6F0] px-3.5 py-1 text-xs text-[#8B6C61] border border-[#D6B98C]/30">
              <Clock className="size-3.5" /> Last updated: 8 November 2026
            </span>
          </div>

          <p className="text-[#493B37] text-base leading-relaxed">
            At <strong>Bhaama Veedhi</strong>, we want you to love every purchase. Please read our return and refund policy before placing an order.
          </p>

          <div className="mt-8 space-y-8">
            {/* 1. Return eligibility */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-full bg-[#6B2C3E] text-xs font-semibold text-white">
                  1
                </span>
                <h2 className="font-serif text-xl font-semibold text-[#6B2C3E]">
                  Return eligibility
                </h2>
              </div>
              <p className="text-[#493B37] pl-9">
                We accept return or exchange requests in the following situations:
              </p>
              <ul className="pl-9 space-y-2 text-[#493B37]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 mt-1 shrink-0" />
                  <span>You received a damaged or defective product.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 mt-1 shrink-0" />
                  <span>You received an incorrect product.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 mt-1 shrink-0" />
                  <span>The product received does not match its description.</span>
                </li>
              </ul>
              <div className="ml-9 mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs sm:text-sm font-medium text-amber-900">
                <Clock className="size-4 text-amber-700 shrink-0" />
                <span>Please report the issue within <strong>48 hours of delivery</strong>.</span>
              </div>
            </section>

            {/* 2. 360° unboxing video requirement */}
            <section className="rounded-xl border-2 border-[#D6B98C] bg-gradient-to-br from-[#FFFDF9] to-[#FAF4EC] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-[#6B2C3E] text-white">
                  <Video className="size-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8B6C61]">
                    Verification Requirement
                  </span>
                  <h2 className="font-serif text-xl font-semibold text-[#6B2C3E]">
                    2. 360° unboxing video requirement
                  </h2>
                </div>
              </div>

              <p className="text-[#493B37] text-sm sm:text-base leading-relaxed">
                To help us verify damaged, missing or incorrect products, customers are requested to record a <strong>clear, continuous 360° unboxing video</strong> while opening their parcel.
              </p>

              <div className="space-y-2.5 rounded-lg bg-white/95 p-5 border border-[#D6B98C]/30">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6B2C3E]">
                  The video should follow these steps:
                </p>
                <ol className="space-y-2.5 text-xs sm:text-sm text-[#493B37]">
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-[#6B2C3E]">1.</span>
                    <span>Start recording before opening the parcel.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-[#6B2C3E]">2.</span>
                    <span>Show all sides of the unopened package (360°).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-[#6B2C3E]">3.</span>
                    <span>Clearly show the shipping label.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-[#6B2C3E]">4.</span>
                    <span>Open the parcel while recording.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-[#6B2C3E]">5.</span>
                    <span>Show the product and packaging clearly from all angles.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-[#6B2C3E]">6.</span>
                    <span>Ensure the video is continuous, without cuts, pauses or editing.</span>
                  </li>
                </ol>
              </div>

              <div className="rounded-lg bg-[#FAF2EB] p-5 border border-[#E8DAD5] space-y-2 text-xs sm:text-sm">
                <p className="font-semibold text-[#6B2C3E] uppercase tracking-wide text-xs">
                  Important:
                </p>
                <ul className="space-y-2 text-[#493B37]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#6B2C3E] font-bold">•</span>
                    <span>Share the video along with your order ID through our official WhatsApp or email.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#6B2C3E] font-bold">•</span>
                    <span>Report any issue within <strong>48 hours of delivery</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#6B2C3E] font-bold">•</span>
                    <span>Our team will review the request and guide you through the next steps.</span>
                  </li>
                </ul>
                <p className="mt-3 text-xs italic text-[#70564D] border-t border-[#E8DAD5] pt-3">
                  If you are unable to provide a video, please still contact us. We will assess your concern individually and in accordance with applicable consumer rights.
                </p>
              </div>
            </section>

            {/* 3. Items not eligible for return */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-full bg-[#6B2C3E] text-xs font-semibold text-white">
                  3
                </span>
                <h2 className="font-serif text-xl font-semibold text-[#6B2C3E]">
                  Items not eligible for return
                </h2>
              </div>
              <p className="text-[#493B37] pl-9">
                For hygiene reasons, we generally do not accept returns for:
              </p>
              <ul className="pl-9 space-y-2 text-[#493B37]">
                <li className="flex items-start gap-2.5">
                  <XCircle className="size-4 text-rose-600 mt-1 shrink-0" />
                  <span>Earrings and other pierced jewellery due to a change of mind.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="size-4 text-rose-600 mt-1 shrink-0" />
                  <span>Products damaged after delivery through improper handling.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="size-4 text-rose-600 mt-1 shrink-0" />
                  <span>Products showing signs of wear or use.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="size-4 text-rose-600 mt-1 shrink-0" />
                  <span>Products returned without original packaging where necessary for assessment.</span>
                </li>
              </ul>
              <p className="pl-9 text-xs text-[#70564D] italic">
                Change-of-mind returns are not ordinarily accepted. This does not affect your rights in cases of defective, incorrect or misdescribed products under applicable law.
              </p>
            </section>

            {/* 4. How to request a return */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-full bg-[#6B2C3E] text-xs font-semibold text-white">
                  4
                </span>
                <h2 className="font-serif text-xl font-semibold text-[#6B2C3E]">
                  How to request a return
                </h2>
              </div>
              <ul className="pl-9 space-y-2 text-[#493B37]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>Contact us through WhatsApp or email.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>Share your order ID and clear pictures of the product.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>Attach the 360° unboxing video, if available.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>Our team will review your request and provide further instructions.</span>
                </li>
              </ul>
            </section>

            {/* 5. Refund process */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-full bg-[#6B2C3E] text-xs font-semibold text-white">
                  5
                </span>
                <h2 className="font-serif text-xl font-semibold text-[#6B2C3E]">
                  Refund process
                </h2>
              </div>
              <ul className="pl-9 space-y-2 text-[#493B37]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>Approved refunds will be processed to the original payment method wherever possible.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>Refunds will generally be initiated within <strong>5–7 business days</strong> after approval.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>The time taken for the amount to reflect may depend on your bank or payment provider.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>Applicable delivery charges will also be addressed where the issue is attributable to us.</span>
                </li>
              </ul>
            </section>

            {/* 6. Exchanges */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-full bg-[#6B2C3E] text-xs font-semibold text-white">
                  6
                </span>
                <h2 className="font-serif text-xl font-semibold text-[#6B2C3E]">
                  Exchanges
                </h2>
              </div>
              <p className="text-[#493B37] pl-9">
                Exchanges may be offered for eligible damaged, defective or incorrectly delivered products, subject to availability.
              </p>
            </section>
          </div>

          {/* WhatsApp Support CTA */}
          <div className="mt-10 rounded-xl bg-[#FAF6F0] p-6 border border-[#D6B98C]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-serif text-lg font-medium text-[#6B2C3E]">
                Need help with your return or exchange?
              </p>
              <p className="text-xs text-[#8B6C61] mt-0.5">
                Our support team is available on WhatsApp to assist you.
              </p>
            </div>
            <a
              href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
                "Hi Bhaama Veedhi! I would like to request assistance with a return/refund."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#6B2C3E] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#52212f] transition-all"
            >
              <MessageCircle className="size-4 text-[#D6B98C]" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <PolicyDialog />
    </div>
  );
}

