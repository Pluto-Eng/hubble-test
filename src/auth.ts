// auth.ts - Main configuration
import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { env, app, enable } from "@/lib/config"

export const { 
  auth, 
  signIn, 
  signOut,
  handlers: { GET, POST }
} = NextAuth({
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login', // Redirect auth errors to login
  },

  session: {
    strategy: "jwt",
    // FINTECH SECURITY: Shorter sessions (15 minutes idle)
    maxAge: app.sessionMaxAge, // 15 minutes - but backend expiry is 24hrs
    updateAge: 5 * 60, // Update session every 5 minutes of activity
  },

  jwt: {
    // JWT max age should match session
    maxAge: app.sessionMaxAge,
  },

  // Enhanced security for fintech
  cookies: {
    sessionToken: {
      name: app.cookies.sessionToken.name,
      options: {
        domain: app.cookies.sessionToken.options.domain,
        httpOnly: app.cookies.sessionToken.options.httpOnly,
        sameSite: app.cookies.sessionToken.options.sameSite, // CSRF protection
        path: app.cookies.sessionToken.options.path,
        secure: app.cookies.sessionToken.options.secure, // HTTPS only in production
        maxAge: app.cookies.sessionToken.options.maxAge,
      },
    },
    callbackUrl: {
      name: app.cookies.callbackUrl.name,
      options: {
        sameSite: app.cookies.callbackUrl.options.sameSite,
        path: app.cookies.callbackUrl.options.path,
        secure: app.cookies.callbackUrl.options.secure,
      },
    },
    csrfToken: {
      name: app.cookies.csrfToken.name,
      options: {
        httpOnly: app.cookies.csrfToken.options.httpOnly,
        sameSite: app.cookies.csrfToken.options.sameSite,
        path: app.cookies.csrfToken.options.path,
        secure: app.cookies.csrfToken.options.secure,
      },
    },
  },

  // Security settings
  useSecureCookies: env === 'production',

  // Custom event handling for audit logging
  // events: {
  //   async signIn({ user, isNewUser }) {
  //     log.info("User signed in", {
  //       userId: user.id,
  //       email: user.email,
  //       userType: (user as any).type,
  //       isNewUser
  //     })
  //   },

  //   async signOut(message) {
  //     const userId = 'token' in message && message.token 
  //     ? (message.token as any).userId 
  //     : 'unknown'
    
  //     log.info("User signed out", {
  //       userId
  //     })
  //   },
  // },

  logger: {
    error(error: Error) {
      log.error('Auth.js Error', '', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      })
    },
    warn(message: string) {
      log.warn('Auth.js Warning', '', {
        message,
        timestamp: new Date().toISOString()
      })
    },
    debug(message: string) { //only logs if debug: true
      log.debug('Auth.js Debug', '', message)
    },
  },

  debug: enable.logging,
  ...authConfig,
})
