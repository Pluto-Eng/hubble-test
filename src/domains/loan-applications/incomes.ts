// Loan Incomes API client
import { ApiClient } from '@/lib/api-client';
import { LoanIncome, CreateLoanIncomeRequest } from './types';

export class LoanIncomesClient extends ApiClient {
  constructor(accountId: string, loanApplicationId: string, authToken?: string) {
    super(`/accounts/${accountId}/loan-applications/${loanApplicationId}/incomes`, authToken);
  }

  async getIncomes(params?: any): Promise<LoanIncome[]> {
    const response = await this.getAll<LoanIncome>(params);
    return response.data;
  }

  async getIncome(id: string): Promise<LoanIncome> {
    return this.getById<LoanIncome>(id);
  }

  async createIncome(data: CreateLoanIncomeRequest): Promise<LoanIncome> {
    return this.create<LoanIncome>(data);
  }

  async updateIncome(id: string, data: Partial<CreateLoanIncomeRequest>): Promise<LoanIncome> {
    return this.update<LoanIncome>(id, data);
  }

  async deleteIncome(id: string): Promise<void> {
    return this.delete(id);
  }
} 