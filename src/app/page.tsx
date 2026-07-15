"use client";

/**
 * ============================================================
 * BHAAMA VEEDHI — Main Page (single `/` route)
 * ============================================================
 * View routing is handled client-side via the Zustand store
 * (store | login | admin), since only `/` is user-visible.
 *
 * Layout:
 *   <root min-h-screen flex flex-col>
 *     <Navbar />              sticky top
 *     <main flex-1>           active view
 *     <Footer mt-auto>        sticky bottom (store + login)
 *   <CartDrawer />            slide-out
 *   <QuickViewDialog />       modal
 *
 * On mount we (a) wait for the persisted store to hydrate to avoid
 * hydration mismatches on the cart badge, and (b) restore the server
 * session so refreshes keep the user/admin signed in.
 * ============================================================
 */
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { Navbar } from "@/components/bv/Navbar";
import { Footer } from "@/components/bv/Footer";
import { CartDrawer } from "@/components/bv/CartDrawer";
import { QuickViewDialog } from "@/components/bv/QuickViewDialog";
import { StoreFront } from "@/components/bv/StoreFront";
import { LoginPage } from "@/components/bv/LoginPage";
import { AdminDashboard } from "@/components/bv/AdminDashboard";

export default function Home() {
  const view = useStore((s) => s.view);
  const setUser = useStore((s) => s.setUser);
  const [hydrated, setHydrated] = useState(false);

  /* Hydration gate (persisted cart) — mount flag is a legitimate,
     well-understood SSR-safe pattern, so we allow the setState-in-effect here. */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  /* Restore session on mount / refresh */
  useEffect(() => {
    if (!hydrated) return;
    (async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch {
        /* ignore — user can browse as guest */
      }
    })();
  }, [hydrated, setUser]);

  // Avoid hydration mismatch for persisted state (cart badge, view)
  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-3">
          <span className="font-serif text-2xl text-maroon">Bhaama Veedhi</span>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-dark">
            Loading…
          </span>
        </div>
      </div>
    );
  }

  const isAdmin = view === "admin";

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {!isAdmin && <Navbar />}

      <main className="flex-1">
        {view === "store" && <StoreFront />}
        {view === "login" && <LoginPage />}
        {view === "admin" && <AdminDashboard />}
      </main>

      {/* Footer sticks to bottom via mt-auto; hidden on admin (dashboard has its own chrome) */}
      {!isAdmin && <Footer />}

      {/* Global overlays */}
      <CartDrawer />
      <QuickViewDialog />
    </div>
  );
}
