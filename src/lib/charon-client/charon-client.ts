import { ApiClient, ApiResult } from "@/lib/api-client"
import { api } from "@/lib/config"
export interface AuthTokens {
    accessToken: string;
    idToken: string;
    refreshToken: string;
    expiresIn: number;
  }
  export interface Profile {
    id: string;
    type?: 'individual' | 'manager' | 'admin';
    nameGiven?: string;
    nameMiddle?: string;
    nameFamily?: string;
    email?: string;
    phone?: string;
    secId?: string;
    cognitoUsername?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  // Registration request payload
export interface RegisterRequest {
  username: string; // aka email
  password: string;
  firstName: string;
  lastName: string;
  type?: string;
}

// Confirmation request payload
export interface ConfirmRequest {
  username: string; //aka email
  code: string;
}

// Login request payload
export interface LoginRequest {
  username: string; //aka email
  password: string;
}

  export class CharonClient extends ApiClient {
    constructor() {
      super("charonClient", api.baseUrl);
    }
  
    async register(userData: RegisterRequest): Promise<ApiResult<AuthTokens>> {
      return this.post<AuthTokens>('/user/register', userData);
    }

    async confirm(userData: ConfirmRequest): Promise<ApiResult<any>> {
      return this.post('/user/confirm', userData);
    }
    
    async login(userData: LoginRequest): Promise<ApiResult<AuthTokens>> {
      return this.post<AuthTokens>('/user/login', userData);
    }

    async logout(accessToken: string): Promise<ApiResult<any>> {
      return this.post('/user/logout', { accessToken });
    }

    async refreshToken(refreshToken: string): Promise<ApiResult<AuthTokens>> {
      return this.post<AuthTokens>('/user/refresh', { refreshToken });
    }

    async getProfile(): Promise<ApiResult<Profile>> {
      return this.get<Profile>('/user/profile');
    }

    async updateProfile(pFields: Partial<Profile>): Promise<ApiResult<Profile>> {
      return this.put<Profile>('/user/profile', pFields);
    }
}
  
export const charonClient = new CharonClient();