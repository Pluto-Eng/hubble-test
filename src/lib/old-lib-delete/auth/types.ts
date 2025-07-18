import { DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      accountId: string | null
      cognitoUsername?: string
      type?: string
    } & DefaultSession["user"]
    accessToken: string
    error?: string
  }

  interface User {
    id: string
    email: string
    name: string
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    accountId: string | null
    cognitoUsername?: string
    type?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    user: {
      id: string
      email: string
      name: string
      accountId: string | null
      cognitoUsername?: string
      type?: string
    }
    error?: string
  }
} 