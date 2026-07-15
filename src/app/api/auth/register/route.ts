/**
 * Bhaama Veedhi — Register API
 * Creates a standard user account (email/password).
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim();

    const existing = await db.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const user = await db.user.create({
      data: {
        name: name ? String(name) : null,
        email: cleanEmail,
        password: hashPassword(password),
        role: "USER",
      },
    });

    await setSessionCookie({
      userId: user.id,
      role: "USER",
      email: user.email,
      name: user.name || user.email.split("@")[0],
    });

    return NextResponse.json({
      user: {
        email: user.email,
        name: user.name || user.email.split("@")[0],
        role: "USER",
      },
      redirect: "store",
    });
  } catch {
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
