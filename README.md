# ✨ Bhaama Veedhi (భామా వీధి)

> *"Every woman deserves a little sparkle in her everyday story ✨"*

A luxury e-commerce storefront for handcrafted Indian jewelry. Built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, **shadcn/ui**, **Prisma (SQLite)**, and **Zustand**.

---

## 📁 Project Structure

```text
Bhaama_Veedhi/
├── db/                   # SQLite database (custom.db)
├── docs/                 # Documentation & media
│   ├── download/         # Seed exports & downloads
│   ├── examples/         # Reference implementations
│   ├── screenshots/      # UI screenshots & preview captures
│   ├── tool-results/     # Build logs & analysis records
│   └── worklog.md        # Detailed engineering log & task history
├── prisma/               # Database schema & migrations
│   └── schema.prisma
├── public/               # Static assets & user uploads
│   ├── products/         # Jewelry catalog product images
│   ├── uploads/          # Admin-uploaded images
│   └── logo.svg
├── scripts/              # Seed & maintenance scripts
│   ├── gen-images.ts     # Catalog image generator
│   └── seed.ts           # Database seeder (products & admin)
├── src/                  # Application source code
│   ├── app/              # Next.js App Router (pages & API routes)
│   ├── components/       # UI components (shadcn/ui & Bhaama Veedhi features)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Auth, database, and utility helpers
│   └── store/            # Zustand client state (cart, auth, view navigation)
└── README.md
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
bun install
```

### 2. Database Setup & Seeding
```bash
bun run db:generate
bun run db:push
bun run scripts/seed.ts
```

### 3. Start Development Server
```bash
bun run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Credentials

### Admin Account
* **Email:** `Dinakar@gmail.com`
* **Password:** `MadhAmma@256`
* **Role:** `ADMIN` (Access to Admin Dashboard, Product CRUD, Image Uploads, Category Management)

### Customer Accounts
* Any customer can register directly via the Sign Up screen.
* Sample customer: `priya@example.com` / `chilledinakar@gmail.com`

---

## 🎨 Brand Identity

* **Primary (Deep Maroon):** `#5E131D`
* **Secondary (Antique Gold):** `#B28A42`
* **Background (Warm Cream):** `#FCF8F5`
* **Typography:** Playfair Display (Headings) & Inter (Body)

