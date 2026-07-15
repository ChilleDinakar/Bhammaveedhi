/**
 * Bhaama Veedhi — Login API
 * Unified portal:
 *  - Admin: hardcoded secure check (Dinakar@gmail.com / MadhAmma@256) -> role ADMIN -> /admin
 *  - User:   email/password against Prisma -> role USER -> storefront
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim();

    /* ---- Admin hardcoded secure check ---- */
    if (cleanEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      await setSessionCookie({
        userId: "admin-bhaama",
        role: "ADMIN",
        email: ADMIN_EMAIL,
        name: "Dinakar",
      });
      return NextResponse.json({
        user: { email: ADMIN_EMAIL, name: "Dinakar", role: "ADMIN" },
        redirect: "admin",
      });
    }

    /* ---- Standard user auth (Prisma) ---- */
    const user = await db.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with that email. Please register first." },
        { status: 404 }
      );
    }
    if (!verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    await setSessionCookie({
      userId: user.id,
      role: user.role === "ADMIN" ? "ADMIN" : "USER",
      email: user.email,
      name: user.name || user.email.split("@")[0],
    });

    return NextResponse.json({
      user: {
        email: user.email,
        name: user.name || user.email.split("@")[0],
        role: user.role === "ADMIN" ? "ADMIN" : "USER",
      },
      redirect: "store",
    });
  } catch {
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
