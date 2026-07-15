"use client";

/**
 * ============================================================
 * BHAAMA VEEDHI — Admin Dashboard (Protected)
 * ============================================================
 *  - Protected: checks /api/auth/session on mount; non-admins are
 *    redirected to the login view.
 *  - Inventory Management UI:
 *      • Add/Edit Product form
 *          - Category: OPEN text field (admin can type any category;
 *            existing categories are offered as suggestions via a datalist).
 *          - Images: MULTIPLE image uploads — pick several files at once,
 *            each is uploaded to /api/upload and appended to the product's
 *            image list. Thumbnails can be removed individually. The first
 *            image is the cover.
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
  GripVertical,
} from "lucide-react";
import { useStore, type Product } from "@/store/useStore";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

type FormState = {
  id?: string;
  title: string;
  description: string;
  currentPrice: string;
  previousPrice: string;
  images: string[]; // multiple images; images[0] is the cover
  category: string; // open text — admin can type anything
  inStock: boolean;
};

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  currentPrice: "",
  previousPrice: "",
  images: [],
  category: "",
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
  const [manualUrl, setManualUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  /* Existing categories -> offered as suggestions in the open category field */
  const existingCategories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

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
  }, [setView, toast]);

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

  /* ---- Multiple image upload ---- */
  const handleUploadMultiple = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of list) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (res.ok && data.url) uploaded.push(data.url as string);
      } catch {
        /* skip this file */
      }
    }
    setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
    setUploading(false);
    if (uploaded.length > 0) {
      toast({
        title: `${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded ✨`,
      });
    }
    if (uploaded.length < list.length) {
      toast({
        title: "Some uploads failed",
        description: `${list.length - uploaded.length} file(s) could not be uploaded.`,
        variant: "destructive",
      });
    }
  };

  /** Remove an image by index. */
  const removeImage = (idx: number) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  /** Move an image up (so the admin can set the cover / reorder). */
  const moveImage = (idx: number, dir: -1 | 1) =>
    setForm((f) => {
      const next = [...f.images];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return f;
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...f, images: next };
    });

  /** Add a manual image URL from the URL input. */
  const addManualUrl = () => {
    const clean = manualUrl.trim();
    if (!clean) return;
    setForm((f) => ({ ...f, images: [...f.images, clean] }));
    setManualUrl("");
  };

  /* ---- Submit (add or edit) ---- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.currentPrice || form.images.length === 0) {
      toast({
        title: "Missing fields",
        description: "Title, description, price and at least one image are required.",
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
        images: form.images,
        category: form.category.trim() || "All",
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
      images: p.images && p.images.length > 0 ? [...p.images] : [],
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

                {/* Category — OPEN text field (admin can type any value) */}
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-maroon">
                    Category{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (type any category you need)
                    </span>
                  </Label>
                  <Input
                    id="category"
                    list="bv-categories"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Necklaces, Bridal, Festive, Everyday…"
                    className="border-gold/30 focus-visible:ring-gold"
                  />
                  <datalist id="bv-categories">
                    {existingCategories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                  <p className="text-xs text-muted-foreground">
                    This is an open field — enter whatever fits your collection.
                    Existing categories are suggested as you type.
                  </p>
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

                {/* Multiple image uploads */}
                <div className="space-y-2">
                  <Label className="text-maroon">
                    Product Images{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (multiple allowed — the first is the cover)
                    </span>
                  </Label>

                  {/* Upload button + dropzone */}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleUploadMultiple(e.target.files);
                        e.target.value = ""; // allow re-selecting same files
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gold/40 bg-cream-deep/30 px-4 py-6 text-center transition-colors hover:border-gold hover:bg-cream-deep/50 disabled:opacity-60"
                  >
                    {uploading ? (
                      <Loader2 className="size-6 animate-spin text-gold-dark" />
                    ) : (
                      <Upload className="size-6 text-gold-dark" />
                    )}
                    <span className="text-sm font-medium text-maroon">
                      {uploading ? "Uploading…" : "Click to upload multiple images"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP — up to 6MB each
                    </span>
                  </button>

                  {/* Thumbnails grid with remove + reorder */}
                  {form.images.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {form.images.map((src, idx) => (
                        <div
                          key={idx}
                          className="group relative aspect-square overflow-hidden rounded-lg border border-gold/30 bg-cream-deep"
                        >
                          { }
                          <img src={src} alt={`Product image ${idx + 1}`} className="h-full w-full object-cover" />

                          {/* Cover badge */}
                          {idx === 0 && (
                            <span className="absolute left-1 top-1 rounded bg-maroon px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-cream">
                              Cover
                            </span>
                          )}

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-maroon/90 text-cream transition-colors hover:bg-maroon"
                            aria-label={`Remove image ${idx + 1}`}
                          >
                            <X className="size-3.5" />
                          </button>

                          {/* Reorder controls */}
                          <div className="absolute inset-x-1 bottom-1 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => moveImage(idx, -1)}
                              disabled={idx === 0}
                              className="flex size-6 items-center justify-center rounded-full bg-cream/90 text-maroon shadow disabled:opacity-30"
                              aria-label="Move left"
                            >
                              <span className="text-xs">‹</span>
                            </button>
                            <GripVertical className="size-3.5 text-cream drop-shadow" />
                            <button
                              type="button"
                              onClick={() => moveImage(idx, 1)}
                              disabled={idx === form.images.length - 1}
                              className="flex size-6 items-center justify-center rounded-full bg-cream/90 text-maroon shadow disabled:opacity-30"
                              aria-label="Move right"
                            >
                              <span className="text-xs">›</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg border border-gold/20 bg-cream-deep/20 px-3 py-3 text-xs text-muted-foreground">
                      <ImageIcon className="size-4 text-gold-dark" />
                      No images yet — upload at least one.
                    </div>
                  )}

                  {/* Manual URL entry (NOT a nested form — uses type="button"
                      so it never submits the outer product form) */}
                  <p className="pt-1 text-xs text-muted-foreground">
                    Or add an image URL:
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={manualUrl}
                      onChange={(e) => setManualUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addManualUrl();
                        }
                      }}
                      placeholder="/products/necklace-vine.png"
                      className="border-gold/30 focus-visible:ring-gold"
                    />
                    <Button
                      type="button"
                      onClick={addManualUrl}
                      variant="outline"
                      className="border-gold/40 text-maroon hover:bg-accent"
                      aria-label="Add image URL"
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
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
                              <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-cream-deep">
                                { }
                                <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
                                {p.images.length > 1 && (
                                  <span className="absolute -right-0.5 -top-0.5 flex min-w-4 h-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-white shadow ring-1 ring-cream">
                                    {p.images.length}
                                  </span>
                                )}
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
