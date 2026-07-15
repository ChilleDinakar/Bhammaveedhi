/**
 * ============================================================
 * BHAAMA VEEDHI — Auth Utilities
 * ============================================================
 * Zero-cost auth (replaces Firebase Auth):
 *  - Admin login: hardcoded secure check (as requested).
 *  - User login/register: email + password stored in Prisma,
 *    passwords hashed with Node's scrypt (no extra deps).
 *  - Session: signed HMAC token in an httpOnly cookie.
 * ============================================================
 */
import crypto from "crypto";
import { cookies } from "next/headers";

/* ---- Admin credentials (hardcoded secure check) ---- */
export const ADMIN_EMAIL = "Dinakar@gmail.com";
export const ADMIN_PASSWORD = "MadhAmma@256";

/* ---- Session signing ---- */
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  "bhaama-veedhi-premium-jewelry-session-secret-2024";

const COOKIE_NAME = "bv_session";

export type SessionPayload = {
  userId: string;
  role: "ADMIN" | "USER";
  email: string;
  name: string;
};

/* ---- Password hashing (scrypt) ---- */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 64).toString("hex");
  // constant-time compare
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(test, "hex"));
}

/* ---- Token sign / verify (HMAC) ---- */
function b64url(buf: Buffer | string) {
  return Buffer.from(buf).toString("base64url");
}

export function signToken(payload: SessionPayload): string {
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyToken(token: string): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");
  try {
    if (sig.length !== expected.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/* ---- Cookie helpers (server-side, via next/headers) ---- */
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function setSessionCookie(payload: SessionPayload) {
  const token = signToken(payload);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAdmin(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
