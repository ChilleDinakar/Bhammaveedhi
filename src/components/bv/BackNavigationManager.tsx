"use client";

/**
 * BHAAMA VEEDHI — Intelligent Back Navigation & Hardware Back Button Manager
 *
 * Solves the single-page / PWA back-button issue where tapping the device/browser
 * back button immediately exits the app because there is only one screen on the stack.
 *
 * Capabilities:
 * 1. History Stack Integration (pushState):
 *    - Policy Modal (#policy-returns, #policy-shipping, #policy-privacy)
 *    - Quick View Product Modal (#product-[id])
 *    - Mobile Navigation Drawer (#menu)
 *    - Cart Drawer (#cart)
 *    - Cart Delivery Address Step (#checkout)
 *    - Secondary Views (#login, #admin)
 *
 * 2. Hardware / Browser Back Handling (popstate):
 *    - In Checkout Address step -> pops back to Cart items review.
 *    - In Cart Drawer -> pops back to Storefront.
 *    - In Quick View Modal -> pops back to Storefront.
 *    - In Policy Modal -> pops back to previous view.
 *    - In Mobile Menu -> closes mobile menu.
 *    - In Login / Admin view -> pops back to Storefront.
 *
 * 3. Root Exit Guard (Home Screen):
 *    - On the root storefront, intercepts hardware back and shows a gentle toast:
 *      "Press back again to exit Bhaama Veedhi ✨"
 *    - If pressed again within 2 seconds, allows the app/browser to exit cleanly.
 *
 * 4. Programmatic Close Sync:
 *    - When the user closes an overlay via UI buttons (X / backdrop / cancel),
 *      it cleanly pops the corresponding history entry so no ghost states linger.
 *
 * 5. Zero-Cost Implementation:
 *    - Pure HTML5 W3C History API & browser standards.
 */
import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";

export function BackNavigationManager() {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const cartOpen = useStore((s) => s.cartOpen);
  const openCart = useStore((s) => s.openCart);
  const closeCart = useStore((s) => s.closeCart);
  const cartStep = useStore((s) => s.cartStep);
  const setCartStep = useStore((s) => s.setCartStep);
  const quickViewProduct = useStore((s) => s.quickViewProduct);
  const closeQuickView = useStore((s) => s.closeQuickView);
  const policyModal = useStore((s) => s.policyModal);
  const closePolicy = useStore((s) => s.closePolicy);
  const mobileMenuOpen = useStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useStore((s) => s.setMobileMenuOpen);

  const { toast } = useToast();

  const currentHashRef = useRef<string>("");
  const isPopStateRef = useRef<boolean>(false);
  const lastRootBackPressRef = useRef<number>(0);
  const initializedRef = useRef<boolean>(false);

  // 1. Initialize root history guard on client mount
  useEffect(() => {
    if (typeof window === "undefined" || initializedRef.current) return;
    initializedRef.current = true;

    // Restore state from initial hash if user opened deep link
    const initialHash = window.location.hash;
    if (initialHash === "#cart") {
      openCart();
    } else if (initialHash === "#checkout") {
      openCart();
      setCartStep("address");
    } else if (initialHash === "#login") {
      setView("login");
    } else if (initialHash === "#admin") {
      setView("admin");
    }

    // Set up root history guard on root page only
    if (window.location.pathname === "/") {
      if (!window.history.state?.bv_guard) {
        window.history.replaceState({ bv_guard: "root_base" }, "", window.location.href);
        window.history.pushState({ bv_guard: "app_active" }, "", window.location.href);
      }
    }
  }, [openCart, setCartStep, setView]);

  // 2. Synchronize UI State changes to Browser History (pushState / pop on UI close)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // If change was initiated by popstate (hardware back), skip pushing
    if (isPopStateRef.current) {
      isPopStateRef.current = false;
      return;
    }

    let targetHash = "";

    if (policyModal) {
      targetHash = `#policy-${policyModal}`;
    } else if (quickViewProduct) {
      targetHash = `#product-${quickViewProduct.id}`;
    } else if (mobileMenuOpen) {
      targetHash = "#menu";
    } else if (cartOpen) {
      targetHash = cartStep === "address" ? "#checkout" : "#cart";
    } else if (view === "login") {
      targetHash = "#login";
    } else if (view === "admin") {
      targetHash = "#admin";
    }

    const previousHash = currentHashRef.current;

    // If an overlay was opened -> push to history
    if (targetHash && targetHash !== previousHash) {
      currentHashRef.current = targetHash;
      window.history.pushState(
        { bv_hash: targetHash, bv_guard: "app_active" },
        "",
        targetHash
      );
    }
    // If an overlay was closed via UI action -> pop history so stack stays clean
    else if (!targetHash && previousHash) {
      currentHashRef.current = "";
      if (window.location.hash) {
        // Pop the history entry that was pushed for this overlay
        window.history.back();
      }
    }
  }, [
    view,
    cartOpen,
    cartStep,
    quickViewProduct,
    policyModal,
    mobileMenuOpen,
  ]);

  // 3. Listen for Hardware / Browser Back Button (popstate)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      isPopStateRef.current = true;
      currentHashRef.current = window.location.hash;

      // Priority 1: Policy Dialog
      if (policyModal) {
        closePolicy();
        return;
      }

      // Priority 2: Quick View Product Modal
      if (quickViewProduct) {
        closeQuickView();
        return;
      }

      // Priority 3: Mobile Menu Drawer
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
        return;
      }

      // Priority 4: Cart Drawer
      if (cartOpen) {
        if (cartStep === "address") {
          // If on address step, hardware back returns to cart items review!
          setCartStep("cart");
          // Re-push #cart so the next back press closes the cart
          window.history.pushState(
            { bv_hash: "#cart", bv_guard: "app_active" },
            "",
            "#cart"
          );
          currentHashRef.current = "#cart";
          return;
        } else {
          // In cart items -> closes cart drawer!
          closeCart();
          return;
        }
      }

      // Priority 5: Login or Admin View
      if (view !== "store") {
        setView("store");
        return;
      }

      // Priority 6: Root Storefront Exit Guard (only on root "/")
      if (window.location.pathname === "/") {
        const now = Date.now();
        if (now - lastRootBackPressRef.current < 2000) {
          // Double back pressed within 2 seconds: let the browser exit!
          toast({
            title: "Exiting Bhaama Veedhi 👋",
            description: "Have a wonderful day!",
            duration: 1500,
          });
          // Pop the root base entry to exit
          window.history.back();
        } else {
          // First back press: show toast and keep user in app
          lastRootBackPressRef.current = now;

          // Re-push active guard state
          window.history.pushState(
            { bv_guard: "app_active" },
            "",
            window.location.pathname + window.location.search
          );

          toast({
            title: "Press back again to exit ✨",
            description: "Tap the back button once more to close Bhaama Veedhi.",
            duration: 2000,
          });
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [
    policyModal,
    quickViewProduct,
    mobileMenuOpen,
    cartOpen,
    cartStep,
    view,
    closePolicy,
    closeQuickView,
    setMobileMenuOpen,
    setCartStep,
    closeCart,
    setView,
    toast,
  ]);

  return null;
}
