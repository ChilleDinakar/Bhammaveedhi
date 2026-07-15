"use client";

/**
 * BHAAMA VEEDHI — Unified Login Portal
 *  - Admin: hardcoded secure check (server-side) -> /admin
 *  - User:   email/password (register or login) -> storefront
 * Elegant centered card with cinematic maroon/gold aesthetic.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User as UserIcon, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useStore } from "@/store/useStore";
import { BRAND } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Mode = "login" | "register";

export function LoginPage() {
  const setView = useStore((s) => s.setView);
  const setUser = useStore((s) => s.setUser);
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { email, password }
          : { name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        toast({
          title: mode === "login" ? "Login failed" : "Registration failed",
          description: data.error || "Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      setUser(data.user);
      toast({
        title: `Welcome${data.user.role === "ADMIN" ? ", Admin" : ""} ✨`,
        description: `Signed in as ${data.user.email}`,
      });

      // Route based on role
      setView(data.redirect === "admin" ? "admin" : "store");
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-maroon px-4 py-12">
      {/* Cinematic background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-dark via-maroon to-maroon-dark" />
        <div className="pointer-events-none absolute -left-20 top-10 size-72 rounded-full bg-gold/20 blur-3xl glow-gold" />
        <div className="pointer-events-none absolute -right-20 bottom-10 size-80 rounded-full bg-gold/15 blur-3xl glow-gold" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Back to store */}
        <button
          onClick={() => setView("store")}
          className="mb-6 flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-gold-light"
        >
          <ArrowLeft className="size-4" />
          Back to store
        </button>

        <div className="overflow-hidden rounded-2xl border border-gold/30 bg-cream shadow-2xl">
          {/* Header */}
          <div className="border-b border-gold/20 bg-gradient-to-r from-maroon to-maroon-light px-6 py-6 text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-cream/10 text-gold-light">
              <Sparkles className="size-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-cream">
              Bhaama Veedhi
            </h1>
            <p className="mt-1 text-xs text-cream/70">
              {mode === "login"
                ? "Welcome back — sign in to continue"
                : "Create your account to begin your story"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-maroon">
                  Full Name
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gold-dark" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="border-gold/30 bg-white pl-9 text-maroon placeholder:text-muted-foreground focus-visible:ring-gold"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-maroon">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gold-dark" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="border-gold/30 bg-white pl-9 text-maroon placeholder:text-muted-foreground focus-visible:ring-gold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-maroon">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gold-dark" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-gold/30 bg-white pl-9 text-maroon placeholder:text-muted-foreground focus-visible:ring-gold"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2 bg-maroon text-cream hover:bg-maroon-light disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>

            {/* Toggle mode */}
            <p className="pt-2 text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  New to Bhaama Veedhi?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-semibold text-maroon underline-offset-2 hover:underline"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-semibold text-maroon underline-offset-2 hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </form>

          {/* Footer note */}
          <div className="border-t border-gold/20 bg-cream-deep/40 px-6 py-4 text-center">
            <p className="text-xs text-muted-foreground">
              Need help?{" "}
              <a
                href={`https://wa.me/${BRAND.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gold-dark hover:underline"
              >
                Chat with us on WhatsApp
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
