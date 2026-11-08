"use client";

/**
 * BHAAMA VEEDHI — Navbar
 * Brand Direction: Minimal Luxury
 * - Top Maroon Announcement Bar: "FREE SHIPPING ON ORDERS ABOVE ₹499"
 * - Centred Bhaama Veedhi Logo + "STYLED FOR EVERY BHAAMA"
 * - Left: Navigation links (Shop, Categories, Our Story, Reviews)
 * - Right: Search, Account / Admin, Shopping Bag with live item count
 */
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Sparkles,
  Search,
} from "lucide-react";
import { useStore, selectCartCount } from "@/store/useStore";
import { BRAND } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function Navbar() {
  const cartCount = useStore(selectCartCount);
  const openCart = useStore((s) => s.openCart);
  const setView = useStore((s) => s.setView);
  const view = useStore((s) => s.view);
  const setCategory = useStore((s) => s.setCategory);
  const activeCategory = useStore((s) => s.activeCategory);
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const products = useStore((s) => s.products);
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  const handleNav = (category: string) => {
    setCategory(category);
    if (view !== "store") setView("store");
    setMobileOpen(false);
    setTimeout(() => {
      document.getElementById("collection")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const scrollToSection = (id: string) => {
    if (view !== "store") setView("store");
    setMobileOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#6B2C3E] px-4 py-2 text-center text-xs tracking-[0.2em] uppercase text-white font-medium flex items-center justify-center gap-2">
        <Sparkles className="size-3 text-[#D6B98C] animate-pulse" />
        <span>FREE SHIPPING ON ORDERS ABOVE ₹499 • DISPATCH IN 3–4 DAYS</span>
        <Sparkles className="size-3 text-[#D6B98C] animate-pulse" />
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="border-b border-[#E8DAD5] bg-[#F8F3EE]/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Navigation links (desktop) or Hamburger (mobile) */}
          <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-start">
            {/* Mobile menu sheet */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-[#6B2C3E] hover:bg-[#E8DAD5]/50 md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-[#F8F3EE] border-[#E8DAD5] p-6">
                <SheetHeader>
                  <SheetTitle className="font-serif text-2xl text-[#6B2C3E] text-left">
                    Bhaama Veedhi
                  </SheetTitle>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#8B6C61] text-left">
                    {BRAND.subtitle}
                  </p>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-1">
                  <button
                    onClick={() => scrollToSection("collection")}
                    className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[#30272A] hover:bg-[#E8DAD5]/60 hover:text-[#6B2C3E]"
                  >
                    Shop All Collection
                  </button>
                  <button
                    onClick={() => scrollToSection("categories")}
                    className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[#30272A] hover:bg-[#E8DAD5]/60 hover:text-[#6B2C3E]"
                  >
                    Shop by Category
                  </button>
                  <button
                    onClick={() => scrollToSection("story")}
                    className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[#30272A] hover:bg-[#E8DAD5]/60 hover:text-[#6B2C3E]"
                  >
                    The Story of Bhaama Veedhi
                  </button>
                  <button
                    onClick={() => scrollToSection("reviews")}
                    className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[#30272A] hover:bg-[#E8DAD5]/60 hover:text-[#6B2C3E]"
                  >
                    Customer Reviews
                  </button>

                  <div className="mt-4 border-t border-[#E8DAD5] pt-4">
                    <p className="px-4 text-xs font-semibold uppercase tracking-wider text-[#8B6C61] mb-2">
                      Categories
                    </p>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleNav(cat)}
                        className={cn(
                          "block w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors",
                          activeCategory.trim().toLowerCase() === cat.trim().toLowerCase()
                            ? "bg-[#6B2C3E] text-white"
                            : "text-[#30272A]/80 hover:bg-[#E8DAD5]/50 hover:text-[#6B2C3E]"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-[#E8DAD5] pt-4 space-y-2">
                    <a
                      href={BRAND.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg px-4 py-2 text-xs font-medium text-[#8B6C61] hover:text-[#6B2C3E]"
                    >
                      Follow on Instagram ({BRAND.instagramHandle})
                    </a>
                    <a
                      href={`https://wa.me/${BRAND.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg px-4 py-2 text-xs font-medium text-[#8B6C61] hover:text-[#6B2C3E]"
                    >
                      Chat with us on WhatsApp
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <button
                onClick={() => scrollToSection("collection")}
                className="text-sm font-medium tracking-wide text-[#30272A]/80 hover:text-[#6B2C3E] transition-colors"
              >
                Collection
              </button>
              <button
                onClick={() => scrollToSection("categories")}
                className="text-sm font-medium tracking-wide text-[#30272A]/80 hover:text-[#6B2C3E] transition-colors"
              >
                Categories
              </button>
              <button
                onClick={() => scrollToSection("story")}
                className="text-sm font-medium tracking-wide text-[#30272A]/80 hover:text-[#6B2C3E] transition-colors"
              >
                Our Story
              </button>
              <button
                onClick={() => scrollToSection("reviews")}
                className="text-sm font-medium tracking-wide text-[#30272A]/80 hover:text-[#6B2C3E] transition-colors"
              >
                Reviews
              </button>
            </nav>
          </div>

          {/* Center: Brand Logo & Subtitle */}
          <div className="flex flex-col items-center justify-center text-center px-2 cursor-pointer group"
            onClick={() => {
              if (view !== "store") setView("store");
              setCategory("All");
              setSearchQuery("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-medium tracking-wide text-[#6B2C3E] transition-colors group-hover:text-[#85374E]">
                Bhaama Veedhi
              </span>
            </div>
            <span className="text-[8px] sm:text-[9.5px] tracking-[0.28em] uppercase text-[#8B6C61] font-medium mt-0.5">
              {BRAND.subtitle}
            </span>
          </div>

          {/* Right: Search, Account, Cart */}
          <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
            {/* Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className={cn(
                "rounded-full transition-colors",
                searchOpen || searchQuery
                  ? "bg-[#6B2C3E] text-white hover:bg-[#85374E]"
                  : "text-[#6B2C3E] hover:bg-[#E8DAD5]/50 hover:text-[#6B2C3E]"
              )}
              aria-label="Search products"
            >
              <Search className="size-4 sm:size-5" />
            </Button>

            {/* User / Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-[#6B2C3E] hover:bg-[#E8DAD5]/50"
                    aria-label="Account menu"
                  >
                    <User className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border-[#E8DAD5]">
                  <DropdownMenuLabel className="font-serif">
                    <span className="block text-[#6B2C3E] font-medium">{user.name}</span>
                    <span className="block text-xs font-sans font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#E8DAD5]" />
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem
                      onClick={() => setView("admin")}
                      className="cursor-pointer text-[#6B2C3E] focus:text-[#6B2C3E] focus:bg-[#F8F3EE]"
                    >
                      <ShieldCheck className="mr-2 size-4 text-[#B5945F]" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" });
                      logout();
                    }}
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
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
                className="rounded-full text-[#6B2C3E] hover:bg-[#E8DAD5]/50"
                aria-label="Login"
              >
                <User className="size-5" />
              </Button>
            )}

            {/* Shopping Bag */}
            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              className="relative rounded-full text-[#6B2C3E] hover:bg-[#E8DAD5]/50"
              aria-label={`Open cart, ${cartCount} items`}
            >
              <ShoppingBag className="size-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex min-w-5 h-5 items-center justify-center rounded-full bg-[#6B2C3E] px-1 text-[11px] font-bold text-white shadow ring-2 ring-[#F8F3EE] animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-[#E8DAD5] bg-white px-4 py-3 sm:px-6">
            <div className="mx-auto flex max-w-3xl items-center gap-3">
              <Search className="size-4 text-[#8B6C61]" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (view !== "store") setView("store");
                }}
                placeholder="Search earrings, necklaces, rings, bangles…"
                autoFocus
                className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm text-[#30272A]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-[#8B6C61] hover:text-[#6B2C3E]"
                >
                  Clear
                </button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(false)}
                className="text-xs text-[#8B6C61] hover:text-[#6B2C3E]"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
