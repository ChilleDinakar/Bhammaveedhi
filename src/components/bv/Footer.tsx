"use client";

/**
 * BHAAMA VEEDHI — Footer
 * Deep Maroon background. Includes Instagram, Email, WhatsApp/Phone,
 * and the brand tagline elegantly displayed.
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
    <footer className="mt-auto bg-maroon text-cream">
      {/* Decorative gold top border */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand + tagline */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-full bg-cream/10 text-gold-light">
                <Sparkles className="size-5" />
              </span>
              <span className="font-serif text-2xl font-bold tracking-wide">
                Bhaama Veedhi
              </span>
            </div>
            <p className="font-serif italic text-gold-light text-lg leading-relaxed max-w-xs">
              {BRAND.tagline}
            </p>
            <p className="text-sm text-cream/70 max-w-sm">
              Handcrafted jewelry for the woman who carries tradition with quiet
              confidence — every piece a little sparkle in her everyday story.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-lg text-gold-light">Explore</h3>
            <ul className="flex flex-col gap-2 text-sm text-cream/80">
              <li>Necklaces</li>
              <li>Earrings</li>
              <li>Bangles</li>
              <li>Rings</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-lg text-gold-light">Connect</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href={BRAND.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-cream/85 transition-colors hover:text-gold-light"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-cream/10 transition-colors group-hover:bg-gold group-hover:text-maroon">
                    <Instagram className="size-4" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium">Instagram</span>
                    <span className="text-xs text-cream/60">@bhaama_veedhi</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="group flex items-center gap-3 text-cream/85 transition-colors hover:text-gold-light"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-cream/10 transition-colors group-hover:bg-gold group-hover:text-maroon">
                    <Mail className="size-4" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium">Email</span>
                    <span className="text-xs text-cream/60">{BRAND.email}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${BRAND.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-cream/85 transition-colors hover:text-gold-light"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-cream/10 transition-colors group-hover:bg-gold group-hover:text-maroon">
                    <MessageCircle className="size-4" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium">WhatsApp / Phone</span>
                    <span className="text-xs text-cream/60">{BRAND.phone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
                  className="group flex items-center gap-3 text-cream/85 transition-colors hover:text-gold-light"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-cream/10 transition-colors group-hover:bg-gold group-hover:text-maroon">
                    <Phone className="size-4" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium">Call us</span>
                    <span className="text-xs text-cream/60">{BRAND.phone}</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-cream/15 pt-6 text-xs text-cream/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Bhaama Veedhi. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Crafted with
            <Heart className="size-3.5 fill-gold text-gold" />
            for every woman&rsquo;s story
          </p>
        </div>
      </div>
    </footer>
  );
}
