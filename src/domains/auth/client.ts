import { ApiClient } from '@/lib/api-client';
import { AuthCredentials, AuthResponse, RegisterRequest, ConfirmSignupRequest } from '@/domains/auth/types';

export class AuthClient extends ApiClient {
  constructor(baseUrl: any = 'api/proxy/') {
    super('auth', baseUrl);
  }

  async register(userData: RegisterRequest) {
    return this.post<AuthResponse>('/user/register', userData);
  }

  async confirm(userData: ConfirmSignupRequest) {
    return this.post('/user/confirm', userData);
  }

  async login(userData: AuthCredentials) {
    return this.post<AuthResponse>('/user/login', userData);
  }

  async logout(accessToken: string) {
    return this.post('/user/logout', { accessToken });
  }

  async refreshToken(refreshToken: string) {
    return this.post<AuthResponse>('/user/refresh', { refreshToken });
  }
}

export const authClient = new AuthClient();
