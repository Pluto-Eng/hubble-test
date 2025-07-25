// Loans API client
import { ApiClient } from '@/lib/api-client';
import { Loan, CreateLoanRequest } from './types';

export class LoansClient extends ApiClient {
  constructor(baseUrl: any = 'api/proxy/') {
    super('loans', baseUrl);
  }

  async getLoans() {
    return this.get<Loan>('/loans');
  }

  async getLoan(id: string) {
    return this.get<Loan>(`/loans/${id}`);
  }

  async updateLoan(id: string, data: Partial<CreateLoanRequest>) {
    return this.put<Loan>(`/loans/${id}`, data);
  }

  async deleteLoan(id: string) {
    return this.delete(`/loans/${id}`);
  }
}

export const loansClient = new LoansClient();
