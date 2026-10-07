import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const cookie = req.cookies.getAll().map(c => `${c.name}=${c.value}`).join("; ");
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${extractToken(cookie)}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
    });

    if (!res.ok) return NextResponse.redirect(new URL("/auth/login", req.url));

    const user = await res.json();
    if (!user?.id) return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

function extractToken(cookie: string): string {
  const match = cookie.match(/sb-[^-]+-auth-token=([^;]+)/);
  if (!match) return "";
  try {
    const decoded = decodeURIComponent(match[1]);
    const parsed = JSON.parse(decoded);
    return parsed.access_token || "";
  } catch { return ""; }
}

export const config = {
  matcher: ["/admin/:path*"],
};
