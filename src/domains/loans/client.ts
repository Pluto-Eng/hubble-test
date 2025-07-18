// Loans API client
import { ApiClient } from '@/lib/api-client';
import { Loan } from './types';

export class LoansClient extends ApiClient {
  constructor(accountId: string, authToken?: string) {
    super('loans', `/accounts/${accountId}/loans`, authToken);
  }

  async getLoans(params?: any): Promise<Loan[]> {
    const response = await this.getAll<Loan>(params);
    return response.data;
  }

  async getLoan(id: string): Promise<Loan> {
    return this.getById<Loan>(id);
  }

  async updateLoan(id: string, data: Partial<CreateLoanRequest>): Promise<Loan> {
    return this.update<Loan>(id, data);
  }

  async deleteLoan(id: string): Promise<void> {
    return this.delete(id);
  }
} 