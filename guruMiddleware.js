import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request) {
  const token = request.cookies.get("auth-token")?.value;
  console.log("Token di cookies:", token); // Log token untuk verifikasi

  if (!token) {
    console.warn("❌ Token tidak ditemukan, redirect ke login.");
    return NextResponse.redirect(new URL("/login-guru", request.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token valid:", decoded);
    return NextResponse.next();
  } catch (error) {
    console.error("❌ Token tidak valid:", error.message);
    return NextResponse.redirect(new URL("/login-guru", request.url));
  }
}

// Proteksi halaman "/guru"
export const config = {
  matcher: ["/guru/:path*"], // Protect all routes under "/guru"
};
