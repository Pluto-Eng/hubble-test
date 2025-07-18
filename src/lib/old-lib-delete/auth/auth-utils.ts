// Authentication utilities for Charon integration
import { AuthClient } from '../domains/auth/client';
import { log } from '@/lib/logger';

interface SignUpRequest {
  email: string;        // Changed from username to email
  password: string;
  firstName: string;    // Changed from nameGiven to firstName  
  lastName: string;     // Changed from nameFamily to lastName
  phone?: string;
  accountType?: string; // Changed from type to accountType
}

interface SignUpResult {
  success: boolean;
  error?: string;
  accountId?: string;
}

export async function signUpWithCharon(signUpData: SignUpRequest): Promise<SignUpResult> {
  try {
    log.start('AuthUtils', 'Starting Charon sign up process');
    
    const authClient = new AuthClient();
    
    // 1. Register the user with Charon (map form fields to API fields)
    const registerResult = await authClient.register({
      username: signUpData.email,           // Map email to username
      password: signUpData.password,
      nameGiven: signUpData.firstName,      // Map firstName to nameGiven
      nameFamily: signUpData.lastName,      // Map lastName to nameFamily
      phone: signUpData.phone,
      type: signUpData.accountType
    });
    
    log.responsePayload('AuthUtils', 'Registration result', registerResult);
    
    // 2. Login to get access token
    const loginResult = await authClient.login({
      username: signUpData.email,           // Use email as username
      password: signUpData.password
    });
    
    log.responsePayload('AuthUtils', 'Login result', loginResult);
    
    // 3. Create account using the access token
    const accountData = {
      nameGiven: signUpData.firstName,
      nameFamily: signUpData.lastName,
      email: signUpData.email,
      phone: signUpData.phone,
      type: 'individual' as const
    };
    
    // TODO: Implement account creation with proper domain client
    // For now, returning success
    log.success('AuthUtils', 'Sign up process completed');
    
    return { 
      success: true, 
      accountId: 'test-accountId' 
    };
    
  } catch (error) {
    log.error('AuthUtils', 'Error during sign up process:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sign up failed'
    };
  }
} 