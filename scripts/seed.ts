/**
 * Bhaama Veedhi — Database seed
 * Seeds premium jewelry products (using generated images) + the admin user.
 *
 * Run: bun run scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";

const db = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

type SeedProduct = {
  title: string;
  description: string;
  currentPrice: number;
  previousPrice?: number;
  // Array of image URLs; stored as a JSON string in the `images` column.
  images: string[];
  category: string;
  inStock: boolean;
};

const products: SeedProduct[] = [
  {
    title: "Emerald Vine Necklace",
    description:
      "A regal emerald and antique-gold vine necklace handcrafted with intricate filigree. Delicate green emeralds trail along an ornate gold vine — a statement of timeless grace for the woman who carries tradition with confidence.",
    currentPrice: 12499,
    previousPrice: 16999,
    images: ["/products/necklace-vine.png", "/products/necklace-pearl.png"],
    category: "Necklaces",
    inStock: true,
  },
  {
    title: "Royal Chandbali Earrings",
    description:
      "Mughal-inspired chandbali earrings in antique gold with cascading ruby drops. The crescent silhouette catches light from every angle, framing the face with old-world charm and a whisper of royalty.",
    currentPrice: 5499,
    previousPrice: 7999,
    images: ["/products/earrings-chandbali.png", "/products/earrings-stud.png"],
    category: "Earrings",
    inStock: true,
  },
  {
    title: "Antique Gold Kada Bangles",
    description:
      "A pair of heritage kada bangles engraved with traditional motifs. The broad antique-gold canvas showcases master engraving — bold, classic, and made to be passed down through generations.",
    currentPrice: 8999,
    previousPrice: 11999,
    images: ["/products/bangle-kada.png", "/products/bangle-stack.png"],
    category: "Bangles",
    inStock: true,
  },
  {
    title: "Solitaire Diamond Ring",
    description:
      "A brilliant solitaire diamond set on a slender gold band. Minimalist yet luminous — the everyday luxury that marks a moment, a promise, or simply a love for fine things.",
    currentPrice: 7299,
    images: ["/products/ring-solitaire.png", "/products/ring-cocktail.png"],
    category: "Rings",
    inStock: true,
  },
  {
    title: "Temple Devi Necklace",
    description:
      "South Indian temple jewellery at its finest — a gold necklace bearing goddess motifs and uncut rubies. Each detail is a tribute to devotion, craftsmanship, and the eternal feminine.",
    currentPrice: 18999,
    previousPrice: 24999,
    images: ["/products/necklace-temple.png"],
    category: "Necklaces",
    inStock: true,
  },
  {
    title: "Pearl Drop Studs",
    description:
      "Freshwater pearl drops suspended from delicate gold studs. Soft, luminous and quietly elegant — the perfect everyday sparkle that transitions effortlessly from day to evening.",
    currentPrice: 2499,
    previousPrice: 3499,
    images: ["/products/earrings-stud.png"],
    category: "Earrings",
    inStock: true,
  },
  {
    title: "Gemstone Bangle Stack",
    description:
      "A curated stack of slender gold bangles accented with delicate gemstones. Light, rhythmic and full of movement — wear them together for a chorus of sparkle or singly for a quiet glow.",
    currentPrice: 6499,
    previousPrice: 8499,
    images: ["/products/bangle-stack.png", "/products/bangle-kada.png"],
    category: "Bangles",
    inStock: true,
  },
  {
    title: "Layered Pearl Necklace",
    description:
      "Strands of luminous freshwater pearls layered with fine gold accents. A modern heirloom that drapes the neckline in soft, cinematic light — elegant for the everyday, unforgettable for the occasion.",
    currentPrice: 4999,
    previousPrice: 6999,
    images: ["/products/necklace-pearl.png", "/products/necklace-vine.png"],
    category: "Necklaces",
    inStock: true,
  },
  {
    title: "Emerald Cocktail Ring",
    description:
      "A bold cocktail ring centring a deep emerald framed by a halo of diamonds on antique gold. Designed to be noticed — a single piece that completes the look and the story.",
    currentPrice: 9999,
    previousPrice: 13999,
    images: ["/products/ring-cocktail.png", "/products/ring-solitaire.png"],
    category: "Rings",
    inStock: true,
  },
];

async function main() {
  console.log("🌱 Seeding Bhaama Veedhi database...");

  // Admin account (role-based, mirrored in DB)
  await db.user.upsert({
    where: { email: "Dinakar@gmail.com" },
    update: {},
    create: {
      name: "Dinakar",
      email: "Dinakar@gmail.com",
      password: hashPassword("MadhAmma@256"),
      role: "ADMIN",
    },
  });
  console.log("✓ Admin user ready (Dinakar@gmail.com)");

  // Products — clear & reseed for idempotency
  await db.product.deleteMany({});
  for (const p of products) {
    await db.product.create({
      data: {
        title: p.title,
        description: p.description,
        currentPrice: p.currentPrice,
        previousPrice: p.previousPrice ?? null,
        // Store the image array as a JSON string (SQLite has no scalar list).
        images: JSON.stringify(p.images),
        category: p.category,
        inStock: p.inStock,
      },
    });
  }
  console.log(`✓ Seeded ${products.length} products`);

  console.log("🎉 Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
