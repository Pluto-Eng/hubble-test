// Authentication API client
import { ApiClient } from '@/lib/api-client';
import { 
  AuthCredentials, 
  AuthResponse, 
  RegisterRequest, 
  ConfirmSignupRequest,
  RefreshTokenRequest,
  LogoutRequest 
} from '@/lib/charon-client/generated';

export class AuthClient extends ApiClient {
  constructor(authToken?: string) {
    super('auth', '/auth', authToken);
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
      throw this.handleError(data);
    }
    return data.data;
  }

  async register(userData: RegisterRequest): Promise<any> {
    const response = await fetch(`${this.baseUrl}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw this.handleError(data);
    }
    return data;
  }

  async confirmSignup(confirmationData: ConfirmSignupRequest): Promise<any> {
    const response = await fetch(`${this.baseUrl}/user/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(confirmationData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw this.handleError(data);
    }
    return data;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/user/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw this.handleError(data);
    }
    return data.data;
  }

  async logout(accessToken: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/user/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw this.handleError(data);
    }
    return data;
  }

  private handleError(data: any): Error {
    // Import ApiError here to avoid circular dependency
    const { ApiError } = require('../../shared/errors');
    if (data.name) {
      return ApiError.fromCognitoError(data);
    }
    return ApiError.fromResponse(data);
  }
} 