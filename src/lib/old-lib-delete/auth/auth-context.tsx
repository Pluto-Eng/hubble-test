'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { AuthService, UserData } from './auth-service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { log } from '@/lib/logger';

log.info('AuthContext', 'AuthContext loaded');

export type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  confirmSignUp: (email: string, confirmationCode: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    accountType: any,
  ) => Promise<void>;
  getAuthHeaders: () => { Authorization: string } | undefined;
  user: UserData | null;
  accountId: string | null;
  setAccountId: (accountId: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const authService = AuthService.getInstance();
  const router = useRouter();

  const updateUserAndAccountState = async () => {
    const isAuth = authService.isAuthenticated();
    setIsAuthenticated(isAuth);

    if (!isAuth) {
      setUser(null);
      setAccountId(null);
      return;
    }

    try {
      const tokenData = authService.getUserData();
      const accessToken = authService.getAccessToken();

      if (!accessToken) {
        throw new Error('No access token found after authentication.');
      }
      
      let response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        // The /user/profile endpoint returns a User object, not an Account
        // We can't get the accountId from here, so we set it to null for now.
        // The main goal is to stop the 401-logout loop.
        log.requestBody('AuthContext', 'updateUserAndAccountState: result', result);
        const userDataFromProfile = result.data;
        log.responsePayload('AuthContext', 'updateUserAndAccountState: userDataFromProfile', userDataFromProfile);

        setUser(userDataFromProfile); // Use the data from the profile endpoint
        // Now fetch accounts to get accountId
        try {
          const accountsRes = await fetch('/api/accounts', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          if (accountsRes.ok) {
            const accountsResult = await accountsRes.json();
            log.responsePayload('AuthContext', 'updateUserAndAccountState: accountsResult', accountsResult);
            if (accountsResult.data && accountsResult.data.length > 0) {
              setAccountId(accountsResult.data[0].id);
            } else {
              setAccountId(null);
            }
          } else {
            setAccountId(null);
          }
        } catch (err) {
          setAccountId(null);
        }
        
      } else if (response.status === 401) {
        // 401 is expected when tokens are invalid/expired - clear tokens and state
        log.error('AuthContext', 'Token is invalid (401), clearing tokens');
        authService.logout(); // This clears the cookies
        setUser(null);
        setAccountId(null);
        setIsAuthenticated(false);
      } else {
        throw new Error('Failed to fetch accounts');
      }
    } catch (error) {
      // Only log unexpected errors, not 401s
      if (error instanceof Error && !error.message.includes('401')) {
        log.error("AuthContext", "Error updating user and account state:", error);
      }
      // Clear state on error
      setUser(null);
      setAccountId(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      log.start("AuthContext", "checkAuth: Starting authentication check.");
      await updateUserAndAccountState();
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // Debug: Log when userData changes
  useEffect(() => {
    log.debug("AuthContext", "user state changed:", user);
    log.debug("AuthContext", "accountId state changed:", accountId);
  }, [user, accountId]);

  const confirmSignUp = async (email: string, confirmationCode: string) => {
    log.start('AuthContext', 'confirmSignUp: Starting confirmation process');
    try {
      setIsLoading(true);
      setError(null);
      await authService.confirmSignUp(email, confirmationCode);
      toast.success('Email confirmed successfully');
    } catch (error) {
      log.error('AuthContext', 'confirmSignUp: Error during confirmation:', error);
      setError(error instanceof Error ? error : new Error('Confirmation failed'));
      toast.error(error instanceof Error ? error.message : 'Confirmation failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      log.check('[AuthContext] login: Starting login process', email, password);
      setIsLoading(true);
      setError(null);
      await authService.login(email, password);
      await updateUserAndAccountState(); // This now updates user and accountId
      toast.success('Login successful');
      router.push('/dashboard'); // Clean navigation
    } catch (error) {
      log.error('AuthContext', 'Error during login:', error);
      setError(error instanceof Error ? error : new Error('Login failed'));
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      log.check('[AuthContext] logout: Starting logout process');
      setIsLoading(true);
      setError(null);
      await authService.logout();
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      log.error('AuthContext', 'logout: Error during logout:', error);
      setError(error instanceof Error ? error : new Error('Logout failed'));
      toast.error(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    accountType: any,
  ) => {
    log.start('AuthContext', 'signUp: Starting sign up process', email, password, firstName, lastName, phone, accountType);
    try {
      setIsLoading(true);
      setError(null);
      const { accountId } = await authService.signUp(email, password, firstName, lastName, phone, accountType);
      log.info('AuthContext', 'signUp: accountId', accountId);
      // After successful signup and account creation, fetch user data again
      // to update the context, including the new accountId.
      const updatedUserData = authService.getUserData();
      log.info('AuthContext', 'signUp: updatedUserData', updatedUserData);
      setUser(updatedUserData);
      setAccountId(accountId || null);
      
      toast.success('Sign up successful! Please check your email to confirm your account.');
      // No need to redirect here, as the user is now logged in.
      // The UI should react to the authenticated state.
      router.push('/dashboard'); 

    } catch (error) {
      log.error('AuthContext', 'signUp: Error during sign up:', error);
      setError(error instanceof Error ? error : new Error('Sign up failed'));
      toast.error(error instanceof Error ? error.message : 'Sign up failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthHeaders = () => {
    const token = authService.getAccessToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return undefined;
  };

  const value: AuthContextType = {
    isAuthenticated,
    loading: isLoading,
    error,
    login,
    logout,
    confirmSignUp,
    signUp,
    getAuthHeaders,
    user,
    accountId,
    setAccountId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 