// Authentication domain types - extending generated Charon client types
import type { 
  AuthRequest as GeneratedAuthRequest,
  AuthResponse as GeneratedAuthResponse
} from '../../charon-client/generated';

// Use generated types as the foundation
export interface AuthCredentials extends GeneratedAuthRequest {}

export interface AuthResponse extends GeneratedAuthResponse {}

// Additional domain-specific types not covered by generated client
export interface RegisterRequest {
  username: string;
  password: string;
  nameGiven: string;
  nameFamily: string;
  phone?: string;
  type?: string;
}

export interface ConfirmSignupRequest {
  username: string;
  confirmationCode: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  accessToken: string;
} 

import { DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

// User role/type definitions
type UserType = "individual" | "manager" | "admin"

// Define your custom additions as separate interfaces first
interface CustomSessionUser {
  id: string //user profile
  email: string | null | undefined
  type: UserType | null | undefined
}

interface CustomSession {
  error?: string | null | undefined // ISODateString from core types
}

interface CustomUser {
  id: string
  email: string | null | undefined
  type: UserType | null | undefined
  // Server-side only (never exposed to client)
  accessToken: string
  refreshToken: string
  idToken?: string
  expiresIn: number
  tokenType: string
}
  
interface CustomJWT {
  userId: string
  email: string | null | undefined
  type: UserType | null | undefined
  accessToken: string
  refreshToken: string
  idToken?: string
  expiresAt: number
  tokenType: string
  error?: string
}  

// Empty interfaces for future customization - safe by default
interface CustomAccount {
    // Add custom account fields here when needed
    // Examples for future use:
    // organizationId?: string
    // permissions?: string[]

    // Placeholder to satisfy ESLint (remove when you add real fields)
    _placeholder?: never
  }
  
  interface CustomProfile {
    // Add custom profile fields here when needed  
    // Examples for future use:
    // department?: string
    // companyRole?: string

    // Placeholder to satisfy ESLint (remove when you add real fields)
    _placeholder?: never
  }

declare module "next-auth" {
  /**
   * Returned by auth(), useSession(), getSession() and received as a prop on the SessionProvider React Context
  * Extended safely to preserve all existing properties
  */

   /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
  interface Session extends DefaultSession, CustomSession {
    user: CustomSessionUser & DefaultSession["user"]
  }

  /**
   * The shape of the user object returned in the OAuth providers' profile callback,
   * or the second parameter of the session callback, when using a database.
   * This is what gets returned from your authorize() callback in Credentials provider.
   * Note: In v5, there's no DefaultUser export, so we manually preserve the standard fields
   */

  /**
   * User interface - what gets returned from authorize() callback
   * This needs to match what you return from your authorize function
   */
  interface User extends CustomUser {
    // Core required fields (these match the DefaultUser interface from core)
    name?: string | null
    image?: string | null
  }

        /**
 * The shape of the account object returned in the OAuth providers' account callback,
 * Usually contains information about the provider being used, like OAuth tokens (access_token, etc).
 * For Credentials provider, this will have:
 * - provider: "credentials"
 * - type: "credentials" 
 * - providerAccountId: user.id
 */
  interface Account extends CustomAccount {
    // All base Account properties are automatically preserved:
    // - provider: string
    // - providerAccountId: string  
    // - type: ProviderType
    // - userId?: string
    // - expires_at?: number
    // Plus all TokenEndpointResponse fields for OAuth (access_token, refresh_token, etc.)
    
    // Add any additional account properties you might need
    // For Credentials provider, you typically don't need to extend this
    provider: string
    providerAccountId: string
    userId?: string
    expires_at?: number
  }

  /**
   * Profile interface - ALWAYS extended safely, ready for future OAuth provider support
   * All standard Profile fields (OpenID Connect claims) are preserved
   * The user info returned from your OAuth provider's profile callback.
   * Not typically used with Credentials provider, but included for completeness.
   */
  interface Profile extends CustomProfile {
    // The core Profile interface already includes standard OpenID Connect claims
    // You can extend this if you use OAuth providers alongside Credentials
    
        // All base Profile properties are automatically preserved:
        // - id, sub, name, given_name, family_name, email, picture, etc.
        // - All standard OpenID Connect claims
    id?: string | null
    sub?: string | null
    name?: string | null
    given_name?: string | null
    family_name?: string | null
    middle_name?: string | null
    nickname?: string | null
    preferred_username?: string | null
    profile?: string | null
    picture?: string | null | any
    website?: string | null
    email?: string | null
    email_verified?: boolean | null
    gender?: string | null
    birthdate?: string | null
    zoneinfo?: string | null
    locale?: string | null
    phone_number?: string | null
    updated_at?: Date | string | number | null
    address?: {
      formatted?: string | null
      street_address?: string | null
      locality?: string | null
      region?: string | null
      postal_code?: string | null
      country?: string | null
    } | null
    [claim: string]: unknown
  }
}

declare module "next-auth/jwt" { // Module Augmentation: This MODIFIES the Session interface in the "next-auth" module
    /**
     * JWT interface - ALWAYS intersected with base JWT to preserve all existing properties
     */
    interface JWT extends DefaultJWT, CustomJWT {
    /** 
   * Returned by the jwt callback and auth(), when using JWT sessions.
   * This is what gets stored in the encrypted JWT token.
   */

      // All base JWT properties (sub, name, email, picture, iat, exp, jti) are preserved
      // Plus all your custom properties from CustomJWT

      // Core JWT fields are already included:
    // - sub?: string (user id)
    // - name?: string | null
    // - email?: string | null  
    // - picture?: string | null
    // - iat?: number (issued at)
    // - exp?: number (expires)
    // - jti?: string (JWT id)
    }
  }

// Charon API response types
export interface CharonAuthResponse {
  success: boolean
  tokens?: {
    accessToken: string
    refreshToken: string
    idToken?: string
    expiresIn: number
  }
  user?: {
    id: string
    email: string
    type: UserType
  }
  accounts?: Array<{
    account_id: string
    grant_type: 'own' | 'managed'
  }>
  error?: string
  feedback?: string
  errors?: any[]
}

export interface CharonUserProfile {
  success: boolean
  user?: {
    id: string
    email?: string
    username?: string
    name?: string
    nameGiven?: string
    nameFamily?: string
    type?: UserType
    role?: UserType
    [key: string]: any
  }
  error?: string
}

// Utility types for RBAC (these remain the same)
export interface RolePermissions {
  individual: string[]
  manager: string[]
  admin: string[]
}

export interface RouteConfig {
  path: string
  requiredRole: UserType
  allowedRoles?: UserType[]
}

// API client types
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    type: UserType
    email?: string
  }
  accessToken?: string
}
