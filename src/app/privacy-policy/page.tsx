import Link from "next/link";
import { Navbar } from "@/components/bv/Navbar";
import { Footer } from "@/components/bv/Footer";
import { CartDrawer } from "@/components/bv/CartDrawer";
import { PolicyDialog } from "@/components/bv/PolicyDialog";
import { ArrowLeft, ShieldCheck, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/format";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Bhaama Veedhi",
  description: "Official Privacy Policy for Bhaama Veedhi. Learn how we safeguard your personal data and respect customer privacy.",
};

export default function PrivacyPolicyPage() {
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
                Privacy Policy
              </h1>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF6F0] px-3.5 py-1 text-xs text-[#8B6C61] border border-[#D6B98C]/30">
              <ShieldCheck className="size-3.5" /> Customer Data Protection
            </span>
          </div>

          <p className="text-[#493B37] text-base leading-relaxed">
            At <strong>Bhaama Veedhi</strong>, your privacy and trust are of paramount importance to us. We are committed to safeguarding your personal information and handling it responsibly.
          </p>

          <div className="mt-8 space-y-6">
            <section className="space-y-3 rounded-xl bg-white p-6 border border-[#D6B98C]/30 shadow-xs">
              <h2 className="font-serif text-xl font-semibold text-[#6B2C3E]">
                1. Information We Collect
              </h2>
              <p className="text-[#493B37]">
                We collect only the essential details required to process your order, deliver your jewellery, and provide customer support:
              </p>
              <ul className="space-y-2 pl-6 text-[#493B37]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>Name, phone number, and delivery address.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>Email address for order confirmations and tracking updates.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>WhatsApp communications for customer support and unboxing verification.</span>
                </li>
              </ul>
            </section>

            <section className="space-y-3 rounded-xl bg-white p-6 border border-[#D6B98C]/30 shadow-xs">
              <h2 className="font-serif text-xl font-semibold text-[#6B2C3E]">
                2. How We Use & Protect Your Information
              </h2>
              <ul className="space-y-2 pl-6 text-[#493B37]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>To pack, dispatch, and track your orders safely to your doorstep.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>We never sell, rent, or trade your personal information to third parties.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#6B2C3E] font-bold">•</span>
                  <span>Address details are shared solely with verified courier partners for delivery fulfillment.</span>
                </li>
              </ul>
            </section>
          </div>

          <div className="mt-10 rounded-xl bg-[#FAF6F0] p-6 border border-[#D6B98C]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-serif text-lg font-medium text-[#6B2C3E]">
                Questions about our privacy practices?
              </p>
              <p className="text-xs text-[#8B6C61] mt-0.5">
                Feel free to connect with our data protection team on WhatsApp.
              </p>
            </div>
            <a
              href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
                "Hi Bhaama Veedhi! I have a question regarding privacy & data."
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
