'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LoginForm } from '@/domains/auth/components/LoginForm';
import { toast } from 'sonner';
import { log } from '@/lib/logger';

log.info('LoginPage', 'LoginPage loaded');

export default function LoginPage() {

    // toast.success('Email confirmed successfully');

    //  toast.error(error instanceof Error ? error.message : 'Confirmation failed');
 
    // toast.success('Login successful');

    // toast.error(error instanceof Error ? error.message : 'Login failed');

    //  toast.success('Logged out successfully');

    // toast.error(error instanceof Error ? error.message : 'Logout failed');


    // toast.success('Sign up successful! Please check your email to confirm your account.');
 
    // toast.error(error instanceof Error ? error.message : 'Sign up failed');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 flex flex-col items-center">
        <Image
          src="/images/logo_lightgrey.png"
          alt="Pluto Credit Logo"
          width={80}
          height={80}
        />
        <LoginForm />
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}