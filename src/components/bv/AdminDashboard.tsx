"use client";

/**
 * ============================================================
 * BHAAMA VEEDHI — Admin Dashboard (Protected)
 * ============================================================
 *  - Protected: checks /api/auth/session on mount; non-admins are
 *    redirected to the login view.
 *  - Inventory Management UI:
 *      • Add/Edit Product form (with image upload -> /api/upload)
 *      • Product list table with Edit & Delete actions
 * ============================================================
 */
import { useEffect, useState, useRef } from "react";
import {
  ShieldCheck,
  Loader2,
  Upload,
  Pencil,
  Trash2,
  Plus,
  X,
  Package,
  LogOut,
  Store,
  Image as ImageIcon,
} from "lucide-react";
import { useStore, type Product } from "@/store/useStore";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["Necklaces", "Earrings", "Bangles", "Rings"];

type FormState = {
  id?: string;
  title: string;
  description: string;
  currentPrice: string;
  previousPrice: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
};

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  currentPrice: "",
  previousPrice: "",
  imageUrl: "",
  category: "Necklaces",
  inStock: true,
};

export function AdminDashboard() {
  const setView = useStore((s) => s.setView);
  const logout = useStore((s) => s.logout);
  const { toast } = useToast();

  const [authChecked, setAuthChecked] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ---- Auth guard ---- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const data = await res.json();
        if (!data.user || data.user.role !== "ADMIN") {
          toast({
            title: "Admin access required",
            description: "Please sign in with admin credentials.",
            variant: "destructive",
          });
          setView("login");
          return;
        }
        setAuthChecked(true);
      } catch {
        setView("login");
      }
    })();
     
  }, []);

  /* ---- Fetch products ---- */
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (authChecked) fetchProducts();
  }, [authChecked]);

  /* ---- Image upload ---- */
  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Upload failed",
          description: data.error || "Please try again.",
          variant: "destructive",
        });
        return;
      }
      setForm((f) => ({ ...f, imageUrl: data.url }));
      toast({ title: "Image uploaded ✨" });
    } catch {
      toast({
        title: "Upload failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  /* ---- Submit (add or edit) ---- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.currentPrice || !form.imageUrl) {
      toast({
        title: "Missing fields",
        description: "Title, description, price and image are required.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        currentPrice: Number(form.currentPrice),
        previousPrice: form.previousPrice ? Number(form.previousPrice) : null,
        imageUrl: form.imageUrl,
        category: form.category,
        inStock: form.inStock,
      };

      const res = editing
        ? await fetch(`/api/products/${form.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Save failed",
          description: data.error || "Please try again.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: editing ? "Product updated ✨" : "Product added ✨",
        description: form.title,
      });
      setForm(EMPTY_FORM);
      setEditing(false);
      fetchProducts();
    } catch {
      toast({
        title: "Save failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ---- Edit ---- */
  const startEdit = (p: Product) => {
    setEditing(true);
    setForm({
      id: p.id,
      title: p.title,
      description: p.description,
      currentPrice: String(p.currentPrice),
      previousPrice: p.previousPrice ? String(p.previousPrice) : "",
      imageUrl: p.imageUrl,
      category: p.category,
      inStock: p.inStock,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm(EMPTY_FORM);
  };

  /* ---- Delete ---- */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        toast({
          title: "Delete failed",
          description: data.error || "Please try again.",
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Product deleted", description: deleteTarget.title });
      fetchProducts();
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    toast({ title: "Signed out" });
  };

  /* ---- Loading guard ---- */
  if (!authChecked) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-gold-dark" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin top bar */}
      <div className="border-b border-gold/20 bg-maroon text-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-cream/10 text-gold-light">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <h1 className="font-serif text-xl font-bold">Admin Dashboard</h1>
              <p className="text-xs text-cream/70">
                Bhaama Veedhi · Inventory Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("store")}
              className="text-cream hover:bg-cream/10 hover:text-cream"
            >
              <Store className="size-4" /> Store
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-cream hover:bg-cream/10 hover:text-cream"
            >
              <LogOut className="size-4" /> Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Package className="size-5" />}
            label="Total Products"
            value={String(products.length)}
          />
          <StatCard
            icon={<Badge className="bg-green-100 text-green-700">In stock</Badge>}
            label="Available"
            value={String(products.filter((p) => p.inStock).length)}
          />
          <StatCard
            icon={<Badge className="bg-maroon/10 text-maroon">Sold out</Badge>}
            label="Out of stock"
            value={String(products.filter((p) => !p.inStock).length)}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-gold/25 bg-white shadow-sm">
              <div className="border-b border-gold/20 bg-cream-deep/40 px-5 py-4">
                <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-maroon">
                  {editing ? (
                    <>
                      <Pencil className="size-4 text-gold-dark" /> Edit Product
                    </>
                  ) : (
                    <>
                      <Plus className="size-4 text-gold-dark" /> Add New Product
                    </>
                  )}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 p-5">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-maroon">Title</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Emerald Vine Necklace"
                    className="border-gold/30 focus-visible:ring-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-maroon">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Detailed product description…"
                    rows={4}
                    className="border-gold/30 focus-visible:ring-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="currentPrice" className="text-maroon">Current Price (Rs.)</Label>
                    <Input
                      id="currentPrice"
                      type="number"
                      value={form.currentPrice}
                      onChange={(e) => setForm({ ...form, currentPrice: e.target.value })}
                      placeholder="12499"
                      className="border-gold/30 focus-visible:ring-gold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="previousPrice" className="text-maroon">Previous Price (Rs.)</Label>
                    <Input
                      id="previousPrice"
                      type="number"
                      value={form.previousPrice}
                      onChange={(e) => setForm({ ...form, previousPrice: e.target.value })}
                      placeholder="16999"
                      className="border-gold/30 focus-visible:ring-gold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-maroon">Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger className="border-gold/30 focus:ring-gold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="inStock"
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                    className="size-4 accent-[#5E131D]"
                  />
                  <Label htmlFor="inStock" className="text-sm text-maroon">
                    In stock
                  </Label>
                </div>

                {/* Image upload */}
                <div className="space-y-1.5">
                  <Label className="text-maroon">Product Image</Label>
                  <div className="flex items-center gap-3">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-gold/30 bg-cream-deep">
                      {form.imageUrl ? (
                         
                        <img src={form.imageUrl} alt="preview" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <ImageIcon className="size-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUpload(f);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="border-gold/40 text-maroon hover:bg-accent"
                      >
                        {uploading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Upload className="size-4" />
                        )}
                        {uploading ? "Uploading…" : "Upload Image"}
                      </Button>
                      {form.imageUrl && (
                        <p className="mt-1 text-xs text-green-700">Image ready ✓</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Or paste an image URL:
                  </p>
                  <Input
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="/products/necklace-vine.png"
                    className="border-gold/30 focus-visible:ring-gold"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 gap-2 bg-maroon text-cream hover:bg-maroon-light"
                  >
                    {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                    {editing ? "Update Product" : "Add Product"}
                  </Button>
                  {editing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                      className="border-gold/40 text-maroon hover:bg-accent"
                    >
                      <X className="size-4" /> Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Product list */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-gold/25 bg-white shadow-sm">
              <div className="border-b border-gold/20 bg-cream-deep/40 px-5 py-4">
                <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-maroon">
                  <Package className="size-4 text-gold-dark" /> Products ({products.length})
                </h2>
              </div>

              {loadingProducts ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="size-8 animate-spin text-gold-dark" />
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
                  <Package className="size-10 text-gold-dark" />
                  <p className="font-serif text-lg text-maroon">No products yet</p>
                  <p className="text-sm">Add your first product using the form.</p>
                </div>
              ) : (
                <div className="max-h-[70vh] overflow-y-auto scrollbar-elegant">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-cream-deep/60 text-xs uppercase tracking-wide text-gold-dark backdrop-blur">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10">
                      {products.map((p) => (
                        <tr key={p.id} className="transition-colors hover:bg-cream-deep/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="size-12 shrink-0 overflow-hidden rounded-md bg-cream-deep">
                                { }
                                <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
                              </div>
                              <span className="font-medium text-maroon line-clamp-1">
                                {p.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-gold-dark">{formatINR(p.currentPrice)}</span>
                            {p.previousPrice && (
                              <span className="ml-1 text-xs text-muted-foreground line-through">
                                {formatINR(p.previousPrice)}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {p.inStock ? (
                              <Badge className="bg-green-100 text-green-700">In stock</Badge>
                            ) : (
                              <Badge className="bg-muted text-muted-foreground">Sold out</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => startEdit(p)}
                                className="size-8 text-maroon hover:bg-accent"
                                aria-label={`Edit ${p.title}`}
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteTarget(p)}
                                className="size-8 text-destructive hover:bg-destructive/10"
                                aria-label={`Delete ${p.title}`}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-cream border-gold/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-maroon">
              Delete this product?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.title} will be permanently removed from your store.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gold/40 text-maroon hover:bg-accent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gold/25 bg-white p-4 shadow-sm">
      <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-maroon">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-serif text-2xl font-bold text-maroon">{value}</p>
      </div>
    </div>
  );
}
