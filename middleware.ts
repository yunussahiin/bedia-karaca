import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ops/ dizinine erişim kontrolü
  if (pathname.startsWith("/ops")) {
    const supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Eğer kullanıcı giriş yapmamışsa ve /ops/login veya /ops/register değilse, login'e yönlendir
    if (!user && !pathname.startsWith("/ops/login") && !pathname.startsWith("/ops/register")) {
      const url = request.nextUrl.clone();
      url.pathname = "/ops/login";
      return NextResponse.redirect(url);
    }

    // Eğer kullanıcı giriş yapmışsa ve /ops/login veya /ops/register'deyse, dashboard'a yönlendir
    if (user && (pathname === "/ops/login" || pathname === "/ops/register")) {
      const url = request.nextUrl.clone();
      url.pathname = "/ops/dashboard";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }
}

export const config = {
  matcher: ["/ops/:path*"],
};
