import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const proxy = auth((req) => {
  const isLogin = req.nextUrl.pathname === "/admin/login";
  const isAdmin = req.auth?.user?.role === "ADMIN";
  if (!isAdmin && !isLogin) return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  if (isAdmin && isLogin) return NextResponse.redirect(new URL("/admin", req.nextUrl));
});

export const config = { matcher: ["/admin/:path*"] };