import  { NextRequest } from "next/server"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { charonClient } from "@/lib/charon-client/charon-client"

export default {
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      name: "credentials",
      credentials: {
        email: {
          type: "email", //might be text
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials, req: NextRequest) => { //if trigger is signIn, this is called
        try {
          const loginRequest = {
            username: credentials?.email,
            password: credentials?.password
          }

          log.start("Auth", "Starting authorization", { loginRequest })

          // You can still access useful request info:
          log.info("Auth", "Request info", {
            userAgent: req.headers.get('user-agent'),
            referer: req.headers.get('referer'),
            timestamp: new Date().toISOString()
          })

          // logic to verify if the user exists
          if (!loginRequest.username || !loginRequest.password) {
            log.error("Auth", "Missing credentials in authorize", loginRequest)
            return null
          }

          log.info("Auth", "Calling charonClient.login", loginRequest)

          // Call Charon API for authentication
          const { data: tokens, errors, feedback, success } = await charonClient.login(loginRequest)
          log.info("Auth", "Charon response", { tokens })

          // Check if login was successful and tokens are present
          if (!success || !tokens) {
            log.error("Auth", "Login failed", { errors, feedback })
            return null
          }

          const { accessToken } = tokens//accessToken is in the data object

          log.start("Auth", "Calling charonClient.getProfile", { accessToken })

          const { data: profile, feedback, errors, success } = await charonClient.getProfile()

          log.info("Auth", "Charon profile response", {
            success,
            profile
          })

          if (!success || !profile) {
            log.error("Auth", "Profile fetch failed", { 
              errors,
              feedback, 
            })
            return null
          }

          const authObj = {
            id: profile.id,
            email: profile.email,
            type: profile.type || "individual", // individual, manager, admin
            // Potentially: Fetch and add organizationId if user.type is 'manager'
            // e.g., if user.type === 'manager', fetch user's organization and add token.organizationId = userOrg.id;
            // Also, if Account is tightly linked to User, store accountId
            // e.g., if user.type === 'individual', fetch user's primary account and add token.accountId = userAccount.id;

            // Tokens stored in JWT (server-side only)
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            idToken: tokens.idToken, // Store ID token if provided
            expiresIn: tokens.expiresIn || 3600, // Default to 1 hour if not provided
            tokenType: "Bearer",
          }

          log.success("Auth", "Charon login successful", authObj)

          // Return MINIMAL session data for NextAuth session - security first
          return authObj
        } catch (error) {
          log.error("Auth", "Authorization exception", {
            error: error instanceof Error ? error.message : error,
            email: credentials.email
          })
          return null // or throw new Error("Invalid credentials.")
        }
      },
    }),
  ],

  callbacks: { //alow you to implement access controls without a database
    //auth.js already handles the JWT lifecycle for session cookies, so we don't need to do anything here
    jwt: async ({ token, user, trigger, session }) => { 
      // called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client). Anything you return here will be saved in the JWT and forwarded to the session callback. There you can control what should be returned to the client. Anything else will be kept from your frontend. The JWT is encrypted by default via your AUTH_SECRET environment variable
      // Store user data and tokens on initial sign in

      // Initial sign in - store minimal data + tokens from authorize
      if (user) {
        token.userId = user.id as string
        token.email = user.email
        token.type = user.type

        // Store Charon tokens server-side only; tokens stay server-side in JWT only, never exposed to client
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.idToken = user.idToken
        token.expiresAt = Date.now() + (user.expiresIn * 1000)
        token.tokenType = user.tokenType

        // Clear any previous errors
        delete token.error
      }

      // Check if token needs refresh (refresh 5 minutes before expiration)
      const shouldRefresh = Date.now() > ((token.expiresAt as number) - 5 * 60 * 1000)
      
      if (shouldRefresh && token.refreshToken) {
        try {
          log.info("Auth", "Refreshing tokens", { userId: token.userId, email: token.email })

          const { data, error, success, feedback, errors } = await charonClient.refreshToken(token.refreshToken)

          if (success && data?.accessToken) {
            token.accessToken = data.accessToken
            token.refreshToken = data.refreshToken || token.refreshToken // Keep old refresh token if new one not provided
            token.idToken = data.idToken || token.idToken
            token.expiresAt = Date.now() + ((data.expiresIn || 3600) * 1000)

            // Clear any refresh errors
            delete token.error

            log.success("Auth", "Tokens refreshed successfully", { userId: token.userId, email: token.email })
          } else { // Refresh failed, force re-login
            log.error("Auth", "Token refresh failed", { 
              userId: token.userId,
              feedback,
              errors
            })

            return { ...token, error: "RefreshAccessTokenError" }
          }
        } catch (error) {
          log.error("Auth", "Token refresh failed:", {
            error: error instanceof Error ? error.message : error,
            userId: token.userId
          })
          return { ...token, error: "RefreshAccessTokenError" }
        }
      }

      // Handle session updates (profile changes, role updates)
      if (trigger === "update" && session) {
        // Allow updating specific fields
        if (session.email) token.email = session.email
        if (session.type) token.userType = session.type
      }

      return token
    },

    session: async ({ session, token }) => {
      // Pass safe token/user data to client session
      if (token.userId) {
        session.user.id = token.userId
        session.user.email = token.email as string
        session.user.type = token.type
        
        // Handle refresh errors
        if (token.error) {
          // Could redirect to login or handle differently
          session.error = token.error
        }
      }

      // NEVER expose tokens to client
      // Tokens stay server-side in JWT only
      return session //Calls to auth() or useSession() will now have access to the user’s id
    },

    authorized: async ({ auth, request: { nextUrl } }: { auth: any, request: NextRequest }) => {
      const isLoggedIn = !!auth?.user && !auth?.error
      const pathname = nextUrl.pathname

      // Define route patterns
      const publicRoutes = ['/', '/about', '/terms', '/privacy']
      const authRoutes = ['/login', '/signup', '/register', '/confirm-signup', '/forgot-password', '/reset-password']
      const userRoutes = ['/dashboard', '/profile', '/accounts', '/loan-applications', '/loans', '/documents']
      const adminRoutes = ['/admin', '/manage', '/users', '/organizations']

       // Allow public routes
      if (publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
        return true
      }

      // Allow auth routes for everyone (don't redirect away from login)
      if (authRoutes.some(route => pathname.startsWith(route))) {
        return true
      }

      // Require authentication for protected routes
      if (!isLoggedIn) {
        const loginUrl = new URL('/login', nextUrl)
        // Only set callbackUrl if it's not already a login page
        if (!authRoutes.some(route => nextUrl.pathname.startsWith(route))) {
          loginUrl.searchParams.set('callbackUrl', nextUrl.href)
        }
        return Response.redirect(loginUrl)
      }

      // Handle token refresh errors
      if (auth.error === "RefreshAccessTokenError") {
        const loginUrl = new URL('/login', nextUrl)
        loginUrl.searchParams.set('error', 'SessionExpired')
        // loginUrl.searchParams.set('callbackUrl', nextUrl.href) //this causes infinite redirect
        return Response.redirect(loginUrl)
      }

      // Role-based access control
      const userType = auth.user.type

      // Admin routes require manager or admin role
      if (adminRoutes.some(route => pathname.startsWith(route))) {
        if (userType !== 'admin' && userType !== 'manager') {
          return Response.redirect(new URL('/dashboard', nextUrl))
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

      return true
    },
  },
} satisfies NextAuthConfig
