/**
 * Bhaama Veedhi — Image Upload API
 * (Replaces Firebase Storage — zero-cost local file storage.)
 * POST /api/upload  (ADMIN only)
 * Accepts multipart/form-data with a single `file` field.
 * Saves to /public/uploads and returns the public URL.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Validate type & size (max 6MB)
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload PNG, JPG, WEBP or GIF." },
        { status: 400 }
      );
    }
    if (file.size > 6 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 6MB." },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const safeName = `${crypto.randomBytes(12).toString("hex")}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, safeName);
    await writeFile(filePath, bytes);

    return NextResponse.json({
      url: `/uploads/${safeName}`,
      name: safeName,
    });
  } catch {
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
