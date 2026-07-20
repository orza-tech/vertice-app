import { NextResponse, type NextRequest } from "next/server";
import { MOCK_SESSION_COOKIE } from "@/lib/supabase/mock/constants";

export function updateSessionMock(request: NextRequest) {
  const session = request.cookies.get(MOCK_SESSION_COOKIE)?.value;

  const isPublicRoute =
    request.nextUrl.pathname.startsWith("/cadastro") ||
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup") ||
    request.nextUrl.pathname.startsWith("/auth");

  if (!session && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}
