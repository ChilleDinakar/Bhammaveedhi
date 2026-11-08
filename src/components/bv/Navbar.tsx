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
      <div className="bg-[#6B2C3E] px-4 py-2 text-center text-xs tracking-[0.2em] text-[#F8F3EE] font-medium flex items-center justify-center gap-2">
        <span className="text-[#D6B98C] text-xs">✦</span>
        <span>Free Shipping on Orders Above ₹499</span>
        <span className="text-[#D6B98C] text-xs">✦</span>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="border-b border-[#E8DAD5]/60 bg-[#FAF6F0]/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Navigation links (desktop) or Hamburger (mobile) */}
          <div className="flex items-center gap-6 flex-1 justify-start">
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
              <SheetContent side="left" className="w-80 bg-[#FAF6F0] border-[#E8DAD5] p-6">
                <SheetHeader>
                  <div className="flex items-center gap-3">
                    <img
                      src="/brand/logo.svg"
                      alt="Bhaama Veedhi"
                      className="h-16 w-auto object-contain"
                    />
                    <div>
                      <SheetTitle className="font-serif text-xl text-[#6B2C3E] text-left">
                        Bhaama Veedhi
                      </SheetTitle>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[#8B6C61] text-left">
                        {BRAND.subtitle}
                      </p>
                    </div>
                  </div>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setView("store");
                      setMobileOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[#30272A] hover:bg-[#E8DAD5]/60 hover:text-[#6B2C3E]"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => scrollToSection("collection")}
                    className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[#30272A] hover:bg-[#E8DAD5]/60 hover:text-[#6B2C3E]"
                  >
                    Shop
                  </button>
                  <button
                    onClick={() => scrollToSection("story")}
                    className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[#30272A] hover:bg-[#E8DAD5]/60 hover:text-[#6B2C3E]"
                  >
                    About Us
                  </button>
                  <button
                    onClick={() => scrollToSection("footer")}
                    className="rounded-lg px-4 py-3 text-left text-sm font-medium text-[#30272A] hover:bg-[#E8DAD5]/60 hover:text-[#6B2C3E]"
                  >
                    Contact
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
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7">
              <button
                onClick={() => {
                  setView("store");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={cn(
                  "relative py-1 text-sm font-medium tracking-wide transition-colors text-[#30272A] hover:text-[#6B2C3E]",
                  view === "store" && !searchQuery && "border-b-2 border-[#6B2C3E] text-[#6B2C3E] pb-0.5"
                )}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("collection")}
                className="text-sm font-medium tracking-wide transition-colors text-[#30272A] hover:text-[#6B2C3E]"
              >
                Shop
              </button>
              <button
                onClick={() => scrollToSection("story")}
                className="text-sm font-medium tracking-wide transition-colors text-[#30272A] hover:text-[#6B2C3E]"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection("footer")}
                className="text-sm font-medium tracking-wide transition-colors text-[#30272A] hover:text-[#6B2C3E]"
              >
                Contact
              </button>
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex flex-col items-center justify-center">
            <button
              onClick={() => {
                setView("store");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group flex flex-col items-center transition-transform hover:scale-102"
              aria-label="Bhaama Veedhi Home"
            >
              <img
                src="/brand/logo.svg"
                alt="Bhaama Veedhi — Styled for Every Bhaama"
                className="h-16 sm:h-20 w-auto object-contain drop-shadow-xs"
              />
            </button>
          </div>

          {/* Right: Search + Divider + Cart + Account */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1">
            {/* Live Search Input Toggle */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center gap-1.5 animate-fade-in bg-white rounded-full border border-[#D6B98C] pl-3 pr-1 py-1 shadow-xs">
                  <Search className="size-3.5 text-[#8B6C61]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jewellery…"
                    className="w-32 sm:w-48 bg-transparent text-xs text-[#30272A] placeholder:text-[#8B6C61]/70 focus:outline-none"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="size-6 rounded-full text-[#8B6C61] hover:text-[#6B2C3E]"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  className="rounded-full text-[#30272A] hover:bg-[#E8DAD5]/50 hover:text-[#6B2C3E]"
                  aria-label="Search collection"
                >
                  <Search className="size-5" />
                </Button>
              )}
            </div>

            {/* Subtle Divider */}
            <span className="hidden sm:inline-block h-4 w-px bg-[#D6B98C]/60" />

            {/* Shopping Bag Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              className="relative rounded-full text-[#30272A] hover:bg-[#E8DAD5]/50 hover:text-[#6B2C3E]"
              aria-label={`Open shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="size-5" />
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#6B2C3E] text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            </Button>

            {/* Account / Admin Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-[#30272A] hover:bg-[#E8DAD5]/50 hover:text-[#6B2C3E]"
                  aria-label="Account options"
                >
                  <User className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-[#E8DAD5]">
                {user ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-[#30272A]">{user.name}</p>
                        <p className="text-xs leading-none text-[#8B6C61]">{user.email}</p>
                        {user.role === "ADMIN" && (
                          <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#6B2C3E]">
                            <ShieldCheck className="size-3" /> Admin Privileges
                          </span>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.role === "ADMIN" && (
                      <DropdownMenuItem
                        onClick={() => setView("admin")}
                        className="cursor-pointer text-[#6B2C3E] font-medium"
                      >
                        <ShieldCheck className="mr-2 size-4 text-[#6B2C3E]" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => setView("store")}
                      className="cursor-pointer"
                    >
                      Storefront
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 size-4" />
                      Sign out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem
                      onClick={() => setView("login")}
                      className="cursor-pointer font-medium text-[#6B2C3E]"
                    >
                      <User className="mr-2 size-4" />
                      Sign In / Register
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
