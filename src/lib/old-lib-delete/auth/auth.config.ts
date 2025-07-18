import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import "./types" // Import type declarations

// Enhanced error handling for Cognito-specific errors
const handleCognitoError = (error: any) => {
  switch (error.name) {
    case 'NotAuthorizedException':
      return { error: 'Invalid credentials' }
    case 'UserNotConfirmedException':
      return { error: 'Please confirm your email address' }
    case 'UserNotFoundException':
      return { error: 'User not found' }
    case 'PasswordResetRequiredException':
      return { error: 'Password reset required' }
    case 'TooManyRequestsException':
      return { error: 'Too many attempts. Please try again later' }
    case 'UsernameExistsException':
      return { error: 'User already exists' }
    default:
      return { error: 'Authentication failed' }
  }
}

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnAuthPages = nextUrl.pathname.startsWith('/login') || 
                           nextUrl.pathname.startsWith('/signup') ||
                           nextUrl.pathname.startsWith('/confirm-signup')
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isOnAuthPages) {
        if (isLoggedIn) return false // Don't redirect, let the page handle it
        return true
      }
      return true
    },
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            accountId: user.accountId,
            cognitoUsername: user.cognitoUsername,
            type: user.type,
          },
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.user = token.user as any
      session.accessToken = token.accessToken as string
      session.error = token.error as string

      return session
    },
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) {
          return null
        }

        const { email, password } = parsedCredentials.data

        try {
          // Call Charon backend login endpoint (which uses Cognito internally)
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/user/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: email,
              password: password,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            const cognitoError = handleCognitoError(errorData)
            throw new Error(cognitoError.error || errorData.message || 'Login failed')
          }

          const data = await response.json()
          
          if (!data.data?.accessToken) {
            throw new Error('Invalid response: missing access token')
          }

          // Fetch user profile from PostgreSQL via Charon API
          const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/user/profile`, {
            headers: {
              'Authorization': `Bearer ${data.data.accessToken}`,
              'Content-Type': 'application/json',
            },
          })

          let userProfile = null
          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
            userProfile = profileData.data
          }

          // Fetch account information from PostgreSQL
          const accountsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/accounts`, {
            headers: {
              'Authorization': `Bearer ${data.data.accessToken}`,
              'Content-Type': 'application/json',
            },
          })

          let accountId = null
          if (accountsResponse.ok) {
            const accountsData = await accountsResponse.json()
            if (accountsData.data && accountsData.data.length > 0) {
              accountId = accountsData.data[0].id
            }
          }

          return {
            id: userProfile?.id || 'unknown',
            email: userProfile?.email || email,
            name: userProfile ? `${userProfile.nameGiven || ''} ${userProfile.nameFamily || ''}`.trim() || email : email,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
            accessTokenExpires: Date.now() + (data.data.expiresIn * 1000),
            accountId: accountId,
            cognitoUsername: userProfile?.cognitoUsername,
            type: userProfile?.type || 'individual',
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
} satisfies NextAuthConfig

// NextAuth instance - must be after authConfig definition
import NextAuth from "next-auth"

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/user/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.data.accessToken,
      accessTokenExpires: Date.now() + (refreshedTokens.data.expiresIn * 1000),
      refreshToken: refreshedTokens.data.refreshToken ?? token.refreshToken, // Fall back to old refresh token
      error: undefined, // Clear any previous errors
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}
