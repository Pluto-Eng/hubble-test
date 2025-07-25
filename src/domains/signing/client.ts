import { ApiClient } from '@/lib/api-client';
// import { Profile } from "@/domains/signing/types";

export class SigningClient extends ApiClient {
  constructor(baseUrl: any = 'api/proxy/') {
    super('signing', baseUrl);
  }

  async getProfile() {
    return this.get('/user/profile');
  }

  async updateProfile() {
    return this.put('/user/profile');
  }
}

export const signingClient = new SigningClient();
