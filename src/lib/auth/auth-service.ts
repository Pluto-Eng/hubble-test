import Cookies from 'js-cookie';

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserData {
  nameGiven?: string; // Changed from firstName
  nameFamily?: string; // Changed from lastName
  email?: string;
  phone?: string;
  accountId?: string;
  activeLoanApplicationId?: string;
}

export class AuthService {
  private static instance: AuthService;
  private tokens: AuthTokens | null = null;

  private constructor() {
    // Load tokens from cookie on initialization
    const storedTokens = Cookies.get('auth_tokens');
    if (storedTokens) {
      try {
        this.tokens = JSON.parse(storedTokens);
      } catch (error) {
        log.error('AuthService', 'Error parsing stored tokens:', error);
        this.clearTokens();
      }
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public isAuthenticated(): boolean {
    return !!this.tokens?.accessToken;
  }

  public getAuthHeaders(): { Authorization: string } | undefined {
    if (this.tokens?.accessToken) {
      return {
        Authorization: `Bearer ${this.tokens.accessToken}`,
      };
    }
    return undefined;
  }

  private saveTokens(tokens: AuthTokens): void {
    try {
      Cookies.set('auth_tokens', JSON.stringify(tokens), { 
        expires: 7, // 7 days
        secure: true,
        sameSite: 'strict'
      });
      this.tokens = tokens;
      log.responsePayload('AuthService', 'Saved tokens to cookie:', {
        hasAccessToken: !!tokens.accessToken,
        hasIdToken: !!tokens.idToken,
        hasRefreshToken: !!tokens.refreshToken
      });
    } catch (error) {
      log.error('AuthService', 'Error saving tokens:', error);
      throw new Error('Failed to save authentication tokens');
    }
  }

  public async login(email: string, password: string): Promise<void> {
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const responseData = await response.json();
      log.responsePayload('AuthService', 'Login response from server:', responseData);

      if (!responseData.data?.accessToken) {
        throw new Error('Invalid response from server: missing access token');
      }

      const tokens: AuthTokens = {
        accessToken: responseData.data.accessToken,
        idToken: responseData.data.idToken || '',
        refreshToken: responseData.data.refreshToken || '',
        expiresIn: responseData.data.expiresIn || 3600,
      };

      this.saveTokens(tokens);
    } catch (error) {
      log.error('AuthService', 'Error during login:', error);
      throw error;
    }
  }

  public async signUp(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string,
    phone: string,
    accountType: any,
  ): Promise<{ accountId?: string }> {
    try {
      log.start('AuthService', 'Starting sign up component');
    
      // 1. Register the user
      const registerRequest = { 
        username: email, // this gets stored as email in the rds users table
        password: password,
        nameGiven: firstName,
        nameFamily: lastName,
        phone: phone,
        type: accountType,
      };
      const registerResponse = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerRequest),
      });

      log.responsePayload('AuthService', 'registerResponse', registerResponse);
      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const registerResult = await registerResponse.json();
      log.responsePayload('AuthService', 'registerResult', registerResult) //returns { id, message, statusCode, data: {cognitoUsername, createdAt, email, id, type, updatedAt } }

      if (registerResult.status === 409) {
        throw new Error(registerResult.error.message || 'User already exists');
      }

      if (registerResult.status !== 201) {
        throw new Error(registerResult.error.message || 'Registration failed with unexpected status');
      }
      log.success('AuthService', 'Registration successful');

      // 2. Log in to get an access token
      await this.login(email, password);
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        throw new Error('Failed to get access token after sign up.');
      }
      log.success('AuthService', 'Login after registration successful');

      // 3. Create the account
      const accountData = {
        nameGiven: firstName,
        nameFamily: lastName,
        email: email,
        phone: phone,
        type: 'individual', // Assuming default type
      };

      log.requestBody('AuthService', 'accountData', accountData);
      const accountResponse = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(accountData),
      });

      log.responsePayload('AuthService', 'accountResponse', accountResponse);
      if (!accountResponse.ok) {
        const errorData = await accountResponse.json();
        // Potentially roll back user creation or flag for admin
        throw new Error(errorData.message || 'Account creation failed after registration');
      }

      const accountResult = await accountResponse.json();
      log.responsePayload('AuthService', 'accountResult', accountResult);
      log.success('AuthService', 'Account creation successful');

      return {
        accountId: accountResult.data?.id
    };
    } catch (error) {
      log.error('AuthService', 'Error during sign up:', error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    this.clearTokens();
  }

  private clearTokens(): void {
    Cookies.remove('auth_tokens');
    this.tokens = null;
  }

  public async confirmSignUp(email: string, confirmationCode: string): Promise<void> {
    try {
      // Call the confirmation endpoint
      const response = await fetch('/api/user/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          code: confirmationCode
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Confirmation failed');
      }

      const result = await response.json();
      log.success('AuthService', 'Confirmation successful:', result);
    } catch (error) {
      log.error('AuthService', 'Error during confirmation:', error);
      throw error;
    }
  }

  public getAccessToken(): string | null {
    return this.tokens?.accessToken || null;
  }

  public getUsername(): string | null {
    return this.tokens?.idToken ? 'user@example.com' : null;
  }

  public getUserData(): UserData | null {
    try {
      if (!this.tokens?.idToken) {
        log.error('AuthService', 'No idToken found in auth tokens');
        return null;
      }

      log.check('AuthService', 'idToken', this.tokens.idToken);
      const [, payload] = this.tokens.idToken.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      log.responsePayload('AuthService', 'Decoded token payload:', decodedPayload);

      // inside getUserData()
      let userData;
      // The logic can be simplified as the properties are the same in both branches
      userData = {
        nameGiven: decodedPayload.given_name || decodedPayload.firstName || decodedPayload.name?.split(' ')[0] || '',
        nameFamily: decodedPayload.family_name || decodedPayload.lastName || decodedPayload.name?.split(' ')[1] || '',
        email: decodedPayload["cognito:username"] || decodedPayload.username || '',
        phone: decodedPayload.phone_number || decodedPayload.phone || '',
        accountId: decodedPayload.accountId || '',
        activeLoanApplicationId: decodedPayload.activeLoanApplicationId || ''
      };

      log.responsePayload('AuthService', 'Extracted user data from token:', userData);
      return userData;
    } catch (error) {
      log.error('AuthService', 'Error parsing user data:', error);
      return null;
    }
  }
} 