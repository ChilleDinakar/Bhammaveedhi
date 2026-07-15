/**
 * ============================================================
 * BHAAMA VEEDHI — Global Store (Zustand)
 * ============================================================
 * Manages three concerns:
 *  1. Shopping cart (persisted to localStorage) — items, qty, totals.
 *  2. App navigation view (store | login | admin) — single-page routing.
 *  3. Auth state (mirrors the server session for the UI).
 *  4. Quick-view product modal + active category filter.
 * ============================================================
 */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Product = {
  id: string;
  title: string;
  description: string;
  currentPrice: number;
  previousPrice: number | null;
  imageUrl: string;
  category: string;
  inStock: boolean;
  createdAt: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type SessionUser = {
  email: string;
  name: string;
  role: "ADMIN" | "USER";
};

export type View = "store" | "login" | "admin";

type StoreState = {
  /* Cart */
  items: CartItem[];
  cartOpen: boolean;
  /* Navigation */
  view: View;
  /* Auth */
  user: SessionUser | null;
  /* Quick view */
  quickViewProduct: Product | null;
  /* Filters */
  activeCategory: string;

  /* Cart actions */
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  /* Navigation actions */
  setView: (view: View) => void;

  /* Auth actions */
  setUser: (user: SessionUser | null) => void;
  logout: () => void;

  /* Quick view */
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  /* Filters */
  setCategory: (category: string) => void;
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      cartOpen: false,
      view: "store",
      user: null,
      quickViewProduct: null,
      activeCategory: "All",

      addToCart: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.product.id === product.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
            cartOpen: true,
          });
        } else {
          set({ items: [...items, { product, quantity }], cartOpen: true });
        }
      },

      removeFromCart: (productId) =>
        set({ items: get().items.filter((i) => i.product.id !== productId) }),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.product.id !== productId) });
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),

      setView: (view) => {
        set({ view });
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },

      setUser: (user) => set({ user }),
      logout: () => set({ user: null, view: "store" }),

      openQuickView: (product) => set({ quickViewProduct: product }),
      closeQuickView: () => set({ quickViewProduct: null }),

      setCategory: (category) => set({ activeCategory: category }),
    }),
    {
      name: "bhaama-veedhi-store",
      // Only persist cart items + category; never persist auth or transient UI state
      partialize: (state) => ({
        items: state.items,
        activeCategory: state.activeCategory,
      }),
    }
  )
);

/* ---- Derived selectors ---- */
export const selectCartCount = (s: StoreState) =>
  s.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectCartTotal = (s: StoreState) =>
  s.items.reduce((sum, i) => sum + i.product.currentPrice * i.quantity, 0);
