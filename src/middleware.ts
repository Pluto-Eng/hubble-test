import { auth } from '@/auth';
import { NextAuthRequest } from 'next-auth';
import { log } from '@/lib/logger';

export default auth((req: NextAuthRequest) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth && !req.auth?.error;

  log.start('Middleware', 'Checking path', pathname);
  log.info('Middleware', 'Auth', {
    user: req.auth?.user
      ? {
          id: req.auth.user.id,
          name: req.auth.user.name, //auth.js user obj
          email: req.auth.user.email,
          type: req.auth.user.type,
          image: req.auth.user.image,
        }
      : null,
    expires: req.auth?.expires,
    error: req.auth?.error,
    isLoggedIn,
  });

  if (isLoggedIn) {
    log.success('Middleware', 'Session found');
  } else {
    log.error('Middleware', 'No session found');
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)', //negative matcher pattern, only allow these go through unauthenticated
  ],
};

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { log } from './lib/utils/logger';
// import authConfig from "./auth.config"
// import NextAuth from "next-auth"
// const { auth } = NextAuth(authConfig);

// if (typeof globalThis !== 'undefined') {
//   globalThis.log = log;
// }

// // Add paths that don't require authentication
// const publicPaths = ['/login', '/register', '/signup', '/confirm-signup', '/forgot-password', '/test/signwell'];

// export default auth(async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const isLoggedIn = !!req.auth
//   const userRole = req.auth?.user?.role

//   log.start('Middleware','Checking path:', pathname);

//   // Check if the path is public
//   if (publicPaths.includes(pathname)) {
//     log.success('Middleware','Public path, allowing access');
//     return NextResponse.next();
//   }

//   // Check for auth token in localStorage
//   const cookieName = 'auth_tokens';

//   const authTokens = req.cookies.get(cookieName);
//   log.check('Middleware','Auth tokens cookie present ❓', !!authTokens);

//   if (!authTokens?.value) {
//     log.error('Middleware', 'No auth tokens found, redirecting to login');
//     // Redirect to login if no auth token is present
//     const url = new URL('/login', req.url);
//     url.searchParams.set('from', pathname);
//     return NextResponse.redirect(url);
//   }

//   try {
//     // Parse the stored tokens
//     const tokens = JSON.parse(authTokens.value);
//     log.success('Middleware', 'Successfully parsed auth tokens');

//     // Check if the token has expired
//     if (!tokens.accessToken) {
//       log.error('Middleware', 'Invalid auth tokens (no accessToken), redirecting to login');
//       const url = new URL('/login', req.url);
//       url.searchParams.set('from', pathname);
//       return NextResponse.redirect(url);
//     }

//     // // Admin routes protection
//     // if (pathname.startsWith("/admin")) {
//     //   if (!isLoggedIn || userRole !== "admin") {
//     //     return NextResponse.redirect(new URL("/login", request.url))
//     //   }
//     // }

//     // if (pathname.startsWith("/dashboard")) {
//     //   if (!isLoggedIn) {
//     //     return NextResponse.redirect(new URL("/login", nextUrl))
//     //   }
//     // }

//     // Add the access token to the request headers for API calls
//     const requestHeaders = new Headers(req.headers);
//     requestHeaders.set('Authorization', `Bearer ${tokens.accessToken}`);
//     log.success('Middleware', 'Added Authorization header, proceeding to protected route');

//     // Return the response with the modified headers
//     return NextResponse.next({
//       request: {
//         headers: requestHeaders,
//       },
//     });
//   } catch (error) {
//     log.error('Middleware', 'Error parsing auth tokens:', error);
//     const url = new URL('/login', req.url);
//     url.searchParams.set('from', pathname);
//     return NextResponse.redirect(url);
//   }

// })
