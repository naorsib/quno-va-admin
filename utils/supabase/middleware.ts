import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

import { routeConsts } from '@/consts/routing.const';

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const user = await supabase.auth.getUser();

  // protected routes
  if (request.nextUrl.pathname.startsWith(routeConsts.appBase)) {
    if (user.error) {
      return NextResponse.redirect(new URL(routeConsts.signIn, request.url));
    }
    if (!user.data.user.email_confirmed_at) {
      return NextResponse.redirect(
        new URL(
          `${routeConsts.verifyEmail}?email=${user.data.user.email}`,
          request.url,
        ),
      );
    }

    if (!user.data.user.phone_confirmed_at) {
      console.log('request.url', request.url);
      return NextResponse.redirect(new URL(routeConsts.verifyOtp, request.url));
    }
    if (user.error) {
      return NextResponse.redirect(new URL(routeConsts.signIn, request.url));
    }
  }

  if (request.nextUrl.pathname === '/' && !user.error) {
    if (!user.data.user.phone_confirmed_at) {
      return NextResponse.redirect(new URL(routeConsts.verifyOtp, request.url));
    }
    return NextResponse.redirect(
      new URL(routeConsts.quincyDashboard, request.url),
    );
  }

  return response;
};
