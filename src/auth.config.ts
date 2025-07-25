import { NextRequest } from 'next/server';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import { charonClient } from '@/lib/charon-client/charon-client';
import '@/domains/auth';
import { User } from 'next-auth';
import { UserType } from '@/domains/auth/types';
import { env } from '@/lib/config';
import { log } from '@/lib/logger';

// Handle SSL for development environment with external API calls
if (env === 'development') {
  // Disable SSL verification for external API calls only
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // to avoid "self signed certificate" errors like UNABLE_TO_VERIFY_LEAF_SIGNATURE
  log.info('Auth', 'Development mode: SSL verification disabled for external APIs');
}

export default {
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      name: 'credentials',
      credentials: {
        email: {
          type: 'email', //might be text
          label: 'Email',
          placeholder: 'johndoe@gmail.com',
        },
        password: {
          type: 'password',
          label: 'Password',
          placeholder: '*****',
        },
      },
      authorize: async (credentials, request: Request) => {
        //if trigger is signIn, this is called
        try {
          const loginRequest = {
            username: credentials?.email,
            password: credentials?.password,
          };

          log.start('Auth', 'Starting authorization', { loginRequest });

          // You can still access useful request info:
          log.info('Auth', 'Request info', {
            userAgent: request.headers.get('user-agent'),
            referer: request.headers.get('referer'),
            timestamp: new Date().toISOString(),
          });

          // logic to verify if the user exists
          if (!loginRequest.username || !loginRequest.password) {
            const safeErr = {
              username: loginRequest.username,
              password: loginRequest.password,
            };
            log.error('Auth', 'Missing credentials in authorize', safeErr);
            return null;
          }

          log.info('Auth', 'Calling charonClient.login', loginRequest);

          // Call Charon API for authentication
          const loginResponse = await charonClient.auth.login({
            username: loginRequest.username.toString(),
            password: loginRequest.password.toString(),
          });

          log.responsePayload('Auth', 'Charon login response', { loginResponse });

          // Check if login was successful and tokens are present
          if (loginResponse.error) {
            const safeErr = {
              errors: loginResponse.error.errors,
              feedback: loginResponse.error.feedback,
            };
            log.error('Auth', 'Login failed', safeErr);
            return null;
          }

          log.info('Auth', 'Charon response', { loginResponse });

          const { accessToken, refreshToken, idToken, expiresIn } = loginResponse.result?.data; //accessToken is in the data object

          log.start('Auth', 'Calling charonClient.getProfile', { accessToken });

          charonClient.setAccessToken(accessToken);
          const profileResponse = await charonClient.user.getProfile();

          log.info('Auth', 'Charon profile response', {
            status: profileResponse.result?.statusCode,
            profile: profileResponse.result?.data,
          });

          if (profileResponse.error || !profileResponse.result?.data) {
            const safeErr = {
              errors: profileResponse.error?.errors,
              feedback: profileResponse.error?.feedback,
            };
            log.error('Auth', 'Profile fetch failed', safeErr);
            return null;
          }

          const authObj = {
            id: profileResponse.result?.data?.id,
            email: profileResponse.result?.data?.email || '',
            type: profileResponse.result?.data?.type || 'individual', // individual, manager, admin
            // Potentially: Fetch and add organizationId if user.type is 'manager'
            // e.g., if user.type === 'manager', fetch user's organization and add token.organizationId = userOrg.id;
            // Also, if Account is tightly linked to User, store accountId
            // e.g., if user.type === 'individual', fetch user's primary account and add token.accountId = userAccount.id;

            // Tokens stored in JWT (server-side only)
            accessToken: accessToken,
            refreshToken: refreshToken,
            idToken: idToken, // Store ID token if provided
            expiresIn: expiresIn, // Default to 1 hour if not provided
            tokenType: 'Bearer',
            name: null,
            image: null,
          } satisfies User;

          log.success('Auth', 'Charon login successful', authObj);

          // Return MINIMAL session data for NextAuth session - security first
          return authObj;
        } catch (error) {
          const safeErr = {
            error: error instanceof Error ? error.message : error,
            email: credentials.email,
          };
          log.error('Auth', 'Authorization exception', safeErr);
          return null; // or throw new Error("Invalid credentials.")
        }
      },
    }),
  ],

  callbacks: {
    //alow you to implement access controls without a database
    //auth.js already handles the JWT lifecycle for session cookies, so we don't need to do anything here
    jwt: async ({ token, user, account, profile, trigger, session }) => {
      // called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client). Anything you return here will be saved in the JWT and forwarded to the session callback. There you can control what should be returned to the client. Anything else will be kept from your frontend. The JWT is encrypted by default via your AUTH_SECRET environment variable
      // Store user data and tokens on initial sign in

      log.start('Auth', 'Starting JWT callback', { token, user, account, profile, trigger, session });
      // Initial sign in - store minimal data + tokens from authorize
      if (user) {
        token.userId = user.id as string;
        token.email = user.email;
        token.type = user.type as UserType;

        // Store Charon tokens server-side only; tokens stay server-side in JWT only, never exposed to client
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.idToken = user.idToken;
        token.expiresAt = Date.now() + user.expiresIn * 1000;
        token.tokenType = user.tokenType;

        // Clear any previous errors
        delete token.error;
      }

      // Check if token needs refresh (refresh 5 minutes before expiration)
      const shouldRefresh = Date.now() > (token.expiresAt as number) - 5 * 60 * 1000;

      if (shouldRefresh && token.refreshToken) {
        try {
          log.info('Auth', 'Refreshing tokens', { userId: token.userId, email: token.email });

          const refreshResponse = await charonClient.auth.refreshToken(token.refreshToken);

          if (refreshResponse.error) {
            const safeErr = {
              userId: token.userId,
              feedback: refreshResponse.error.feedback,
              errors: refreshResponse.error.errors,
            };
            log.error('Auth', 'Token refresh failed', safeErr);
          } else if (refreshResponse.result?.data?.accessToken) {
            token.accessToken = refreshResponse.result?.data?.accessToken;
            token.refreshToken = refreshResponse.result?.data?.refreshToken || token.refreshToken; // Keep old refresh token if new one not provided
            token.idToken = refreshResponse.result?.data?.idToken || token.idToken;
            token.expiresAt = Date.now() + (refreshResponse.result?.data?.expiresIn || 3600) * 1000;

            // Clear any refresh errors
            delete token.error;

            log.success('Auth', 'Tokens refreshed successfully', { userId: token.userId, email: token.email });
          } else {
            // Refresh failed, force re-login
            const safeErr = {
              userId: token.userId,
              error: token.error,
            };
            log.error('Auth', 'Token refresh failed', safeErr);

            return { ...token, error: 'RefreshAccessTokenError' };
          }
        } catch (error) {
          const safeErr = {
            error: error instanceof Error ? error.message : error,
            userId: token.userId,
          };
          log.error('Auth', 'Token refresh failed:', safeErr);
          return { ...token, error: 'RefreshAccessTokenError' };
        }
      }

      // Handle session updates (profile changes, role updates)
      if (trigger === 'update' && session) {
        // Allow updating specific fields
        if (session.email) token.email = session.email;
        if (session.type) token.userType = session.type;
      }

      return token;
    },

    session: async ({ session, token }) => {
      // Pass safe token/user data to client session
      if (token.userId) {
        session.user.id = token.userId;
        session.user.email = token.email as string;
        session.user.type = token.type || 'individual';

        // Handle refresh errors
        if (token.error) {
          // Could redirect to login or handle differently
          session.error = token.error;
        }
      }

      // NEVER expose tokens to client
      // Tokens stay server-side in JWT only
      return session; //Calls to auth() or useSession() will now have access to the user’s id
    },

    authorized: async ({ auth, request: { nextUrl } }: { auth: any; request: NextRequest }) => {
      const isLoggedIn = !!auth?.user && !auth?.error;
      const pathname = nextUrl.pathname;

      // Define route patterns
      const publicRoutes = ['/', '/about', '/terms', '/privacy'];
      const authRoutes = ['/login', '/signup', '/register', '/confirm-signup', '/forgot-password', '/reset-password'];
      const userRoutes = ['/dashboard', '/profile', '/accounts', '/loan-applications', '/loans', '/documents'];
      const adminRoutes = ['/admin', '/manage', '/users', '/organizations'];

      // Allow public routes
      if (publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
        return true;
      }

      // Allow auth routes for everyone (don't redirect away from login)
      if (authRoutes.some((route) => pathname.startsWith(route))) {
        return true;
      }

      // Require authentication for protected routes
      if (!isLoggedIn) {
        const loginUrl = new URL('/login', nextUrl);
        // Only set callbackUrl if it's not already a login page
        if (!authRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
          loginUrl.searchParams.set('callbackUrl', nextUrl.href);
        }
        return Response.redirect(loginUrl);
      }

      // Handle token refresh errors
      if (auth.error === 'RefreshAccessTokenError') {
        const loginUrl = new URL('/login', nextUrl);
        loginUrl.searchParams.set('error', 'SessionExpired');
        // loginUrl.searchParams.set('callbackUrl', nextUrl.href) //this causes infinite redirect
        return Response.redirect(loginUrl);
      }

      // Role-based access control
      const userType = auth.user.type;

      // Admin routes require manager or admin role
      if (adminRoutes.some((route) => pathname.startsWith(route))) {
        if (userType !== 'admin' && userType !== 'manager') {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
      }

      //   // Add user info to headers for server components
      // const requestHeaders = new Headers(req.headers);
      // requestHeaders.set('x-user-id', session.user.id);
      // requestHeaders.set('x-user-role', session.user.role);
      // if (session.accessToken) {
      //   requestHeaders.set('authorization', `Bearer ${session.accessToken}`);
      // }

      log.success('middleware', 'Access granted, proceeding to route');

      return true;
    },
  },
} satisfies NextAuthConfig;
