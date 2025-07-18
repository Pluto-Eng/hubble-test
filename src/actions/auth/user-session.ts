'use server'

import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const callbackUrl = formData.get('callbackUrl') as string || '/dashboard'

    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid email or password'
        case 'CallbackRouteError':
          return 'Authentication failed. Please try again.'
        default:
          return 'An error occurred during login'
      }
    }
    throw error
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: '/login' })
}