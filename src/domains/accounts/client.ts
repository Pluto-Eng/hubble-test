// Accounts API client
import { ApiClient } from '@/lib/api-client';
import { Account, CreateAccountRequest, UpdateAccountRequest } from './types';

export class AccountsClient extends ApiClient {
  constructor(authToken?: string) {
    super('accounts', '/accounts', authToken);
  }

  async getAccounts(params?: any): Promise<Account[]> {
    const response = await this.getAll<Account>(params);
    return response.data;
  }

  async getAccount(id: string): Promise<Account> {
    return this.getById<Account>(id);
  }

  async createAccount(data: CreateAccountRequest): Promise<Account> {
    return this.create<Account>(data);
  }

  async updateAccount(id: string, data: UpdateAccountRequest): Promise<Account> {
    return this.update<Account>(id, data);
  }

  async deleteAccount(id: string): Promise<void> {
    return this.delete(id);
  }
} 