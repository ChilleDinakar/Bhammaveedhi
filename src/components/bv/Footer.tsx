"use client";

/**
 * BHAAMA VEEDHI — Footer
 * Exactly matched to user interface mockup:
 * - Maroon background (#6B2C3E)
 * - Column 1: Arch Logo badge
 * - Column 2: Quick Links (Shop, About Us, Contact)
 * - Column 3: Policies (Shipping Policy, Return & Exchange, Privacy Policy)
 * - Column 4: Let's Stay Connected ♡ (Instagram & WhatsApp circular buttons)
 * - Column 5: Subscribe to our newsletter (Pill input with arrow button)
 * - Bottom Bar: "© 2025 Bhaama Veedhi. All rights reserved."
 */
import { useState } from "react";
import { Instagram, MessageCircle, ArrowRight, Heart } from "lucide-react";
import { BRAND } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";

export function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const openPolicy = useStore((s) => s.openPolicy);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Please enter a valid email",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Welcome to the Bhaama Veedhi family! ✨",
      description: "Thank you for subscribing to our newsletter.",
    });
    setEmail("");
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer id="footer" className="mt-auto bg-[#6B2C3E] text-[#FAF6F0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-12 items-start">
          {/* Column 1: Brand Logo Badge */}
          <div className="md:col-span-3 flex flex-col items-start">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group text-left"
              aria-label="Back to top"
            >
              <img
                src="/brand/footer-logo.png"
                alt="Bhaama Veedhi — Styled for Every Bhaama"
                className="h-20 sm:h-24 w-auto object-contain transition-transform group-hover:scale-102"
              />
            </button>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="font-serif text-base font-medium text-white tracking-wide">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#F8F3EE]/85 font-sans">
              <li>
                <button
                  onClick={() => scrollTo("collection")}
                  className="transition-colors hover:text-[#D6B98C]"
                >
                  Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("reviews")}
                  className="transition-colors hover:text-[#D6B98C]"
                >
                  Customer Reviews
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hi Bhaama Veedhi! I have a question about your collection ♡")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#D6B98C]"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="font-serif text-base font-medium text-white tracking-wide">
              Policies
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#F8F3EE]/85 font-sans">
              <li>
                <button
                  onClick={() => openPolicy("shipping")}
                  className="text-left transition-colors hover:text-[#D6B98C]"
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy("returns")}
                  className="text-left transition-colors hover:text-[#D6B98C]"
                >
                  Return & Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy("privacy")}
                  className="text-left transition-colors hover:text-[#D6B98C]"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Let's Stay Connected ♡ */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="font-serif text-base font-medium text-white tracking-wide">
              Let&apos;s Stay Connected ♡
            </h4>
            <div className="flex items-center gap-3 pt-1">
              {/* Instagram circular button */}
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @bhaama_veedhi"
                className="flex size-9 items-center justify-center rounded-full border border-white/60 text-white transition-all hover:border-[#D6B98C] hover:bg-white hover:text-[#6B2C3E]"
              >
                <Instagram className="size-4" />
              </a>

              {/* WhatsApp circular button */}
              <a
                href={`https://wa.me/${BRAND.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp with Bhaama Veedhi"
                className="flex size-9 items-center justify-center rounded-full border border-white/60 text-white transition-all hover:border-[#D6B98C] hover:bg-white hover:text-[#6B2C3E]"
              >
                <MessageCircle className="size-4" />
              </a>
            </div>
          </div>

          {/* Column 5: Subscribe to our newsletter */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="font-serif text-base font-medium text-white tracking-wide">
              Subscribe to our newsletter
            </h4>
            <form onSubmit={handleSubscribe} className="relative mt-1">
              <div className="flex items-center rounded-full bg-[#FAF6F0] p-1 shadow-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-transparent px-4 py-2 text-xs text-[#30272A] placeholder:text-[#8B6C61]/70 focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#6B2C3E] text-white transition-transform hover:scale-105"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-14 border-t border-white/15 pt-6 text-center text-xs text-[#F8F3EE]/70 font-sans">
          <p>© 2025 Bhaama Veedhi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
