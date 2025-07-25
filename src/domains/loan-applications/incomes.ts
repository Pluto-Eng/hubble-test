// Loan Incomes API client
import { ApiClient } from '@/lib/api-client';
import { LoanIncome, CreateLoanIncomeRequest } from './types';

export class LoanIncomesClient extends ApiClient {
  constructor(baseUrl: any = 'api/proxy/') {
    super('loan-incomes', baseUrl);
  }

  async getIncomes() {
    return this.get<LoanIncome>('/loan-incomes');
  }

  async getIncome(id: string) {
    return this.get<LoanIncome>(`/loan-incomes/${id}`);
  }

  async createIncome(data: CreateLoanIncomeRequest) {
    return this.post<LoanIncome>(`/loan-incomes`, data);
  }

  async updateIncome(id: string, data: Partial<CreateLoanIncomeRequest>) {
    return this.put<LoanIncome>(`/loan-incomes/${id}`, data);
  }

  async deleteIncome(id: string) {
    return this.delete(`/loan-incomes/${id}`);
  }
}

export const loanIncomesClient = new LoanIncomesClient();
