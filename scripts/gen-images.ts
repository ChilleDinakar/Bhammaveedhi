/**
 * Bhaama Veedhi — Jewelry Product Image Generator
 *
 * Generates a hero banner + 9 premium jewelry product images using the
 * z-ai-web-dev-sdk image generation API.
 *
 * Brand vibe: elegant, classic, premium, cinematic.
 * Colors: deep maroon (#5E131D), antique gold (#B28A42), cream (#FCF8F5).
 *
 * Usage:  bun run /home/z/my-project/scripts/gen-images.ts
 */

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PUBLIC_PRODUCTS_DIR = '/home/z/my-project/public/products';

interface ImageJob {
  name: string;
  filename: string;
  size: '1024x1024' | '1344x768';
  prompt: string;
}

const IMAGES: ImageJob[] = [
  {
    name: 'Hero Banner',
    filename: 'hero.png',
    // NOTE: The task spec requested 1440x720, but the image-generation API
    // rejects it (720 is not a multiple of 32). 1344x768 is the closest
    // supported wide-landscape size (both dims are multiples of 32, total
    // pixels 1,032,192 < 2^22). It yields the same 16:9-ish hero aspect ratio.
    size: '1344x768',
    prompt:
      'Cinematic luxury jewelry hero banner, elegant Indian woman wearing ornate gold necklace and earrings, deep maroon and antique gold tones, soft warm cinematic lighting, premium editorial photography, bokeh background, opulent and regal mood, high detail',
  },
  {
    name: 'Vine Necklace',
    filename: 'necklace-vine.png',
    size: '1024x1024',
    prompt:
      'Professional product photography of an emerald and gold vine necklace on a cream silk background, antique gold with green emerald stones, intricate filigree work, studio lighting, luxury jewelry catalog, top-down view, high detail',
  },
  {
    name: 'Chandbali Earrings',
    filename: 'earrings-chandbali.png',
    size: '1024x1024',
    prompt:
      'Professional product photography of gold chandbali earrings with ruby drops on a cream background, traditional Indian jhumka style, antique gold finish, studio lighting, luxury jewelry catalog, high detail',
  },
  {
    name: 'Kada Bangle',
    filename: 'bangle-kada.png',
    size: '1024x1024',
    prompt:
      'Professional product photography of a pair of antique gold kada bangles with intricate engraving on cream background, traditional Indian design, studio lighting, luxury jewelry catalog, high detail',
  },
  {
    name: 'Solitaire Ring',
    filename: 'ring-solitaire.png',
    size: '1024x1024',
    prompt:
      'Professional product photography of a gold solitaire ring with a large diamond on cream background, elegant band, studio lighting, luxury jewelry catalog, macro shot, high detail',
  },
  {
    name: 'Temple Necklace',
    filename: 'necklace-temple.png',
    size: '1024x1024',
    prompt:
      'Professional product photography of a South Indian temple jewelry gold necklace with goddess motifs and ruby stones on cream background, antique gold, studio lighting, luxury jewelry catalog, high detail',
  },
  {
    name: 'Pearl Stud Earrings',
    filename: 'earrings-stud.png',
    size: '1024x1024',
    prompt:
      'Professional product photography of gold stud earrings with pearl drops on cream background, minimalist elegant design, studio lighting, luxury jewelry catalog, high detail',
  },
  {
    name: 'Gold Bangle Stack',
    filename: 'bangle-stack.png',
    size: '1024x1024',
    prompt:
      'Professional product photography of a stack of thin gold bangles with delicate gemstone accents on cream background, studio lighting, luxury jewelry catalog, high detail',
  },
  {
    name: 'Pearl Layered Necklace',
    filename: 'necklace-pearl.png',
    size: '1024x1024',
    prompt:
      'Professional product photography of a pearl and gold layered necklace on cream background, elegant freshwater pearls with gold accents, studio lighting, luxury jewelry catalog, high detail',
  },
  {
    name: 'Cocktail Ring',
    filename: 'ring-cocktail.png',
    size: '1024x1024',
    prompt:
      'Professional product photography of a gold cocktail ring with a large emerald gemstone and diamond halo on cream background, studio lighting, luxury jewelry catalog, macro shot, high detail',
  },
];

// Delay between generations to avoid rate limiting (ms).
const DELAY_MS = 2000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function humanFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Generate a single image. Returns true on success, false on failure.
 */
async function generateImage(zai: any, job: ImageJob): Promise<boolean> {
  const outputPath = path.join(PUBLIC_PRODUCTS_DIR, job.filename);

  // Skip if the image already exists (resumable generation).
  if (fs.existsSync(outputPath)) {
    const stat = fs.statSync(outputPath);
    if (stat.size > 0) {
      console.log(
        `[SKIP] ${job.name} already exists -> ${outputPath} (${humanFileSize(stat.size)})`,
      );
      return true;
    }
  }

  try {
    console.log(`[GEN] ${job.name} -> ${outputPath} (${job.size})`);
    const response = await zai.images.generations.create({
      prompt: job.prompt,
      size: job.size,
    });

    if (!response?.data?.[0]?.base64) {
      throw new Error('No base64 image data returned from API');
    }

    const buffer = Buffer.from(response.data[0].base64, 'base64');
    fs.writeFileSync(outputPath, buffer);

    console.log(
      `   ✓ OK  ${humanFileSize(buffer.length)}  (${buffer.length} bytes)`,
    );
    return true;
  } catch (err: any) {
    console.error(`   ✗ FAILED: ${err?.message ?? err}`);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(PUBLIC_PRODUCTS_DIR)) {
    fs.mkdirSync(PUBLIC_PRODUCTS_DIR, { recursive: true });
  }

  console.log('==========================================================');
  console.log(' Bhaama Veedhi — Jewelry Image Generator');
  console.log('==========================================================');
  console.log(`Output dir: ${PUBLIC_PRODUCTS_DIR}`);
  console.log(`Total jobs: ${IMAGES.length}`);
  console.log(`Delay:      ${DELAY_MS}ms between generations`);
  console.log('----------------------------------------------------------');

  const zai = await ZAI.create();

  const succeeded: ImageJob[] = [];
  const failed: ImageJob[] = [];

  for (let i = 0; i < IMAGES.length; i++) {
    const job = IMAGES[i];
    const ok = await generateImage(zai, job);
    if (ok) {
      succeeded.push(job);
    } else {
      failed.push(job);
    }
    // Delay between generations (not after the last one)
    if (i < IMAGES.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  // ------------------------------------------------------------------
  // Retry pass for any failed images (single retry each)
  // ------------------------------------------------------------------
  if (failed.length > 0) {
    console.log('----------------------------------------------------------');
    console.log(`Retrying ${failed.length} failed image(s)...`);
    console.log('----------------------------------------------------------');
    const stillFailed: ImageJob[] = [];

    for (let i = 0; i < failed.length; i++) {
      const job = failed[i];
      const ok = await generateImage(zai, job);
      if (ok) {
        succeeded.push(job);
      } else {
        stillFailed.push(job);
      }
      if (i < failed.length - 1) {
        await sleep(DELAY_MS);
      }
    }
    failed.length = 0;
    failed.push(...stillFailed);
  }

  // ------------------------------------------------------------------
  // Final summary
  // ------------------------------------------------------------------
  console.log('==========================================================');
  console.log(' FINAL SUMMARY');
  console.log('==========================================================');
  console.log(`✓ Succeeded: ${succeeded.length}/${IMAGES.length}`);
  if (failed.length > 0) {
    console.log(`✗ Failed:    ${failed.length}`);
    for (const f of failed) {
      console.log(`   - ${f.name} (${f.filename})`);
    }
  } else {
    console.log('All images generated successfully!');
  }

  // Print a verified file listing with sizes
  console.log('----------------------------------------------------------');
  console.log('Files on disk:');
  for (const job of IMAGES) {
    const p = path.join(PUBLIC_PRODUCTS_DIR, job.filename);
    if (fs.existsSync(p)) {
      const stat = fs.statSync(p);
      console.log(`  ✓ ${job.filename.padEnd(28)} ${humanFileSize(stat.size).padStart(12)}`);
    } else {
      console.log(`  ✗ ${job.filename.padEnd(28)}       MISSING`);
    }
  }
  console.log('==========================================================');

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Fatal error in main:', err);
  process.exit(1);
});
