import Link from "next/link";
import { Navbar } from "@/components/bv/Navbar";
import { Footer } from "@/components/bv/Footer";
import { CartDrawer } from "@/components/bv/CartDrawer";
import { PolicyDialog } from "@/components/bv/PolicyDialog";
import { ArrowLeft, Clock, Truck, PackageCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/format";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy — Bhaama Veedhi",
  description: "Official Shipping & Delivery Policy for Bhaama Veedhi. Learn about processing time, delivery estimates, shipping charges, and order tracking.",
};

export default function ShippingPolicyPage() {
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

        {/* Header Card */}
        <div className="rounded-2xl border border-[#D6B98C]/40 bg-white/90 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8DAD5] pb-4 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#8B6C61] font-semibold">
                BHAAMA VEEDHI
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#6B2C3E] font-normal mt-1">
                Shipping & Delivery Policy
              </h1>
              <p className="text-xs text-[#8B6C61] uppercase tracking-wider mt-1">
                Shipping Policy – Bhaama Veedhi
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <Truck className="size-3.5" /> All India Delivery
            </span>
          </div>

          <p className="text-[#493B37] text-base leading-relaxed">
            We aim to deliver your favourite jewellery safely and as quickly as possible.
          </p>

          <div className="mt-8 space-y-6">
            {/* Free Shipping Highlight Banner */}
            <div className="rounded-xl border-2 border-[#D6B98C] bg-gradient-to-r from-[#FAF6F0] via-[#FFFDF9] to-[#FAF4EC] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8B6C61]">
                  Complimentary Delivery
                </span>
                <h2 className="font-serif text-2xl font-semibold text-[#6B2C3E]">
                  Free Shipping on Orders Above ₹499
                </h2>
                <p className="text-xs sm:text-sm text-[#493B37] mt-1">
                  Orders below ₹499 carry a nominal shipping fee of ₹60, clearly displayed at checkout before payment.
                </p>
              </div>
              <div className="shrink-0 rounded-full bg-[#6B2C3E] px-5 py-2.5 text-xs font-semibold text-white uppercase tracking-wider shadow-sm">
                Pan-India
              </div>
            </div>

            {/* Order processing time */}
            <section className="space-y-3 rounded-xl bg-white p-6 border border-[#D6B98C]/30 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="size-5 text-[#6B2C3E]" />
                <h2 className="font-serif text-xl font-semibold text-[#6B2C3E]">
                  Order processing time
                </h2>
              </div>
              <ul className="space-y-2 text-[#493B37] pl-8">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>Orders are usually processed and dispatched within <strong>3–4 business days</strong> after order confirmation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>Orders placed on Sundays or public holidays may take additional processing time.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>You will receive an update once your order has been dispatched.</span>
                </li>
              </ul>
            </section>

            {/* Delivery time */}
            <section className="space-y-3 rounded-xl bg-white p-6 border border-[#D6B98C]/30 shadow-xs">
              <div className="flex items-center gap-2.5">
                <PackageCheck className="size-5 text-[#6B2C3E]" />
                <h2 className="font-serif text-xl font-semibold text-[#6B2C3E]">
                  Delivery time
                </h2>
              </div>
              <ul className="space-y-2 text-[#493B37] pl-8">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>Delivery generally takes around <strong>5–10 business days</strong> after dispatch, depending on your location and courier service.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>Remote locations may require additional delivery time.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>Delivery estimates are indicative and may change due to courier delays, weather conditions or other circumstances beyond our control.</span>
                </li>
              </ul>
            </section>

            {/* Shipping charges */}
            <section className="space-y-3 rounded-xl bg-white p-6 border border-[#D6B98C]/30 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Truck className="size-5 text-[#6B2C3E]" />
                <h2 className="font-serif text-xl font-semibold text-[#6B2C3E]">
                  Shipping charges
                </h2>
              </div>
              <ul className="space-y-2 text-[#493B37] pl-8">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span><strong>Free shipping on orders above ₹499.</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>Shipping charges for orders below ₹499 will be displayed at checkout, before payment.</span>
                </li>
              </ul>
            </section>

            {/* Order tracking */}
            <section className="space-y-3 rounded-xl bg-white p-6 border border-[#D6B98C]/30 shadow-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="size-5 text-emerald-600" />
                <h2 className="font-serif text-xl font-semibold text-[#6B2C3E]">
                  Order tracking
                </h2>
              </div>
              <p className="text-[#493B37] pl-8">
                Once your order is shipped, we will share tracking details through your registered mobile number, email or WhatsApp, where available.
              </p>
            </section>
          </div>

          {/* WhatsApp Support CTA */}
          <div className="mt-10 rounded-xl bg-[#FAF6F0] p-6 border border-[#D6B98C]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-serif text-lg font-medium text-[#6B2C3E]">
                Track an existing shipment or have a delivery question?
              </p>
              <p className="text-xs text-[#8B6C61] mt-0.5">
                Reach out to us on WhatsApp with your Order ID for real-time tracking updates.
              </p>
            </div>
            <a
              href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
                "Hi Bhaama Veedhi! I would like to check the tracking status of my order."
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
