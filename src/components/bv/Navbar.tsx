"use client";

/**
 * BHAAMA VEEDHI — Navbar
 * Sticky top bar: Logo (left) · Nav links (center) · Icons (right).
 * Cream background, maroon text, antique-gold hover accents.
 * Cart icon carries a dynamic item-count badge.
 */
import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useStore, selectCartCount } from "@/store/useStore";
import { BRAND } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", category: "All" },
  { label: "Necklaces", category: "Necklaces" },
  { label: "Earrings", category: "Earrings" },
  { label: "Bangles", category: "Bangles" },
  { label: "Rings", category: "Rings" },
];

export function Navbar() {
  const cartCount = useStore(selectCartCount);
  const openCart = useStore((s) => s.openCart);
  const setView = useStore((s) => s.setView);
  const setCategory = useStore((s) => s.setCategory);
  const activeCategory = useStore((s) => s.activeCategory);
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (category: string) => {
    setCategory(category);
    setView("store");
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-cream/95 backdrop-blur-md border-b border-gold/30 shadow-sm">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => handleNav("All")}
          className="flex items-center gap-2 group"
          aria-label="Bhaama Veedhi home"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-maroon text-gold-light shadow-md transition-transform group-hover:scale-105">
            <Sparkles className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg sm:text-xl font-bold text-maroon tracking-wide">
              Bhaama Veedhi
            </span>
            <span className="hidden sm:block text-[10px] tracking-[0.2em] uppercase text-gold-dark">
              Fine Jewelry
            </span>
          </span>
        </button>

        {/* Center nav (desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.category)}
              data-active={activeCategory === link.category}
              className={cn(
                "nav-underline text-sm font-medium tracking-wide transition-colors",
                activeCategory === link.category
                  ? "text-maroon"
                  : "text-foreground/70 hover:text-maroon"
              )}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* User / Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-maroon hover:bg-accent hover:text-maroon"
                  aria-label="Account menu"
                >
                  <User className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-serif">
                  <span className="block text-maroon">{user.name}</span>
                  <span className="block text-xs font-sans font-normal text-muted-foreground">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "ADMIN" && (
                  <DropdownMenuItem
                    onClick={() => setView("admin")}
                    className="cursor-pointer text-maroon focus:text-maroon"
                  >
                    <ShieldCheck className="mr-2 size-4 text-gold-dark" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    logout();
                  }}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView("login")}
              className="rounded-full text-maroon hover:bg-accent hover:text-maroon"
              aria-label="Login"
            >
              <User className="size-5" />
            </Button>
          )}

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            onClick={openCart}
            className="relative rounded-full text-maroon hover:bg-accent hover:text-maroon"
            aria-label={`Open cart, ${cartCount} items`}
          >
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-w-5 h-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-white shadow ring-2 ring-cream animate-scale-in">
                {cartCount}
              </span>
            )}
          </Button>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-maroon hover:bg-accent md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-cream border-gold/30">
              <SheetHeader>
                <SheetTitle className="font-serif text-maroon text-left">
                  Bhaama Veedhi
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNav(link.category)}
                    className={cn(
                      "rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors",
                      activeCategory === link.category
                        ? "bg-maroon text-cream"
                        : "text-foreground/80 hover:bg-accent hover:text-maroon"
                    )}
                  >
                    {link.label}
                  </button>
                ))}
                <div className="mt-4 border-t border-gold/20 pt-4">
                  <Link
                    href={BRAND.instagram}
                    target="_blank"
                    className="block rounded-lg px-4 py-3 text-left text-sm font-medium text-foreground/80 hover:bg-accent hover:text-maroon"
                  >
                    Follow on Instagram
                  </Link>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="block rounded-lg px-4 py-3 text-left text-sm font-medium text-foreground/80 hover:bg-accent hover:text-maroon"
                  >
                    {BRAND.email}
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
