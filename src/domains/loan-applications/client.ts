// Loan Applications API client
import { ApiClient } from '@/lib/api-client';
import { LoanApplication, CreateLoanApplicationRequest } from './types';

export class LoanApplicationsClient extends ApiClient {
  constructor(baseUrl: any = 'api/proxy/') {
    super('loan-applications', baseUrl);
  }

  async getApplications() {
    return this.get<LoanApplication>('/loan-applications');
  }

  async getApplication(id: string) {
    return this.get<LoanApplication>(`/loan-applications/${id}`);
  }

  async createApplication(data: CreateLoanApplicationRequest) {
    return this.post<LoanApplication>(`/loan-applications`, data);
  }

  async updateApplication(id: string, data: Partial<CreateLoanApplicationRequest>) {
    return this.put<LoanApplication>(`/loan-applications/${id}`, data);
  }

  async deleteApplication(id: string) {
    return this.delete(`/loan-applications/${id}`);
  }
}

export const loanApplicationsClient = new LoanApplicationsClient();
