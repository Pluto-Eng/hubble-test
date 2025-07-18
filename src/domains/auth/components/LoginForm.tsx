'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { authenticate } from '@/actions/auth/user-session';
import { signInSchema } from '../validation';
import { log } from '@/lib/logger';

type LoginFormValues = z.infer<typeof signInSchema>;

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  
  // Get callback URL from search params
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      
      log.start('LoginForm', 'Attempting login with Auth.js v5 server action:', { email: data.email });

      // Create FormData for server action
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('callbackUrl', callbackUrl);

      // Call the server action
      const result = await authenticate(undefined, formData);

      if (result) {
        // If there's a result, it's an error message
        setError(result);
        toast.error(result);
        log.error('LoginForm', 'Login failed:', { error: result });
      } else {
        // Success! The server action will handle the redirect
        log.success('LoginForm', 'Login successful');
        toast.success('Welcome back!');
        // No need to manually redirect - server action handles it
      }
    } catch (err: unknown) {
      console.error('LoginForm', 'Login error:', err);
      let errorMessage = 'An error occurred during login. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      log.error('LoginForm', 'Login exception:', { error: err });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Sign in to your account
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            variant="ghost" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Log In'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

// import { signIn } from "@/auth"
 
// export function SignIn() {
//   return (
//     <form
//       action={async (formData) => {
//         "use server"
//         await signIn("credentials", formData)
//       }}
//     >
//       <label>
//         Email
//         <input name="email" type="email" />
//       </label>
//       <label>
//         Password
//         <input name="password" type="password" />
//       </label>
//       <button>Sign In</button>
//     </form>
//   )
// }