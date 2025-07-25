// Accounts API client
import { ApiClient } from '@/lib/api-client';
import { Account, CreateAccountRequest } from '@/domains/accounts/types';

export class AccountsClient extends ApiClient {
  constructor(baseUrl: any = 'api/proxy/') {
    super('accounts', baseUrl);
  }

  async getAccounts() {
    return this.get<Account>('/accounts');
  }

  async getAccount(id: string) {
    return this.get<Account>(`/accounts/${id}`);
  }

  async createAccount(data: Partial<CreateAccountRequest>) {
    return this.post<CreateAccountRequest>(`/accounts`, data);
  }

  async updateAccount(id: string, data: Partial<Account>) {
    return this.put<Account>(`/accounts/${id}`, data);
  }

  async deleteAccount(id: string) {
    return this.delete(`/accounts/${id}`);
  }
}

export const accountsClient = new AccountsClient();
