"use client";

/**
 * BHAAMA VEEDHI — Footer
 * Maroon background (#6B2C3E) with Champagne Gold (#D6B98C) & Ivory (#F8F3EE) accents.
 * Includes Instagram, Email, WhatsApp "CHAT WITH US ♡", and policy details.
 */
import {
  Instagram,
  Mail,
  Phone,
  MessageCircle,
  Sparkles,
  Heart,
} from "lucide-react";
import { BRAND } from "@/lib/format";

export function Footer() {
  return (
    <footer className="mt-auto bg-[#6B2C3E] text-[#F8F3EE]">
      {/* Decorative gold top border */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#D6B98C] to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand + tagline */}
          <div className="flex flex-col gap-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#F8F3EE]/10 text-[#D6B98C]">
                <Sparkles className="size-5" />
              </span>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wide text-[#F8F3EE]">
                  Bhaama Veedhi
                </span>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#D6B98C]">
                  {BRAND.subtitle}
                </p>
              </div>
            </div>
            <p className="font-serif italic text-[#D6B98C] text-lg leading-relaxed max-w-md">
              &ldquo;{BRAND.tagline}&rdquo;
            </p>
            <p className="text-sm text-[#F8F3EE]/75 max-w-md leading-relaxed font-sans">
              Handcrafted daily-wear and festive jewelry for the woman who carries tradition with quiet confidence — every piece styled for every Bhaama.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hi Bhaama Veedhi! I have a question about your collection ♡")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#D6B98C] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#30272A] shadow-sm transition-all hover:bg-[#F8F3EE] hover:shadow-md"
              >
                <MessageCircle className="size-4 text-[#6B2C3E]" />
                CHAT WITH US ♡
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-lg text-[#D6B98C] font-semibold tracking-wide">
              Shop Collections
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[#F8F3EE]/80 font-sans">
              <li><a href="#collection" className="transition-colors hover:text-[#D6B98C]">Earrings</a></li>
              <li><a href="#collection" className="transition-colors hover:text-[#D6B98C]">Necklaces</a></li>
              <li><a href="#collection" className="transition-colors hover:text-[#D6B98C]">Bracelets & Bangles</a></li>
              <li><a href="#collection" className="transition-colors hover:text-[#D6B98C]">Rings & Chains</a></li>
              <li><a href="#collection" className="transition-colors hover:text-[#D6B98C]">New Arrivals</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-lg text-[#D6B98C] font-semibold tracking-wide">
              Connect With Us
            </h3>
            <ul className="flex flex-col gap-3 text-sm font-sans">
              <li>
                <a
                  href={BRAND.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-[#F8F3EE]/85 transition-colors hover:text-[#D6B98C]"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#F8F3EE]/10 transition-colors group-hover:bg-[#D6B98C] group-hover:text-[#6B2C3E]">
                    <Instagram className="size-4" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium">Instagram</span>
                    <span className="text-xs text-[#F8F3EE]/60">@bhaama_veedhi 🤍</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="group flex items-center gap-3 text-[#F8F3EE]/85 transition-colors hover:text-[#D6B98C]"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#F8F3EE]/10 transition-colors group-hover:bg-[#D6B98C] group-hover:text-[#6B2C3E]">
                    <Mail className="size-4" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium">Email</span>
                    <span className="text-xs text-[#F8F3EE]/60">{BRAND.email}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${BRAND.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-[#F8F3EE]/85 transition-colors hover:text-[#D6B98C]"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#F8F3EE]/10 transition-colors group-hover:bg-[#D6B98C] group-hover:text-[#6B2C3E]">
                    <Phone className="size-4" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium">WhatsApp / Orders</span>
                    <span className="text-xs text-[#F8F3EE]/60">{BRAND.phone}</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Shipping / promise strip */}
        <div className="mt-12 rounded-xl bg-[#F8F3EE]/5 p-4 text-center text-xs text-[#F8F3EE]/75 border border-[#D6B98C]/20">
          Dispatched within 3–4 business days across India • Free shipping on orders above ₹499 • Handcrafted with love
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#F8F3EE]/15 pt-6 text-xs text-[#F8F3EE]/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Bhaama Veedhi. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Styled with
            <Heart className="size-3.5 fill-[#D6B98C] text-[#D6B98C]" />
            for Every Bhaama
          </p>
        </div>
      </div>
    </footer>
  );
}
