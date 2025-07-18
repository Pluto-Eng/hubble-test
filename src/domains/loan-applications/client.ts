// Loan Applications API client
import { BaseApiClient } from '../../shared/api';
import { LoanApplication, CreateLoanApplicationRequest } from './types';

export class LoanApplicationsClient extends BaseApiClient {
  constructor(accountId: string, authToken?: string) {
    super(`/accounts/${accountId}/loan-applications`, authToken);
  }

  async getApplications(params?: any): Promise<LoanApplication[]> {
    const response = await this.getAll<LoanApplication>(params);
    return response.data;
  }

  async getApplication(id: string): Promise<LoanApplication> {
    return this.getById<LoanApplication>(id);
  }

  async createApplication(data: CreateLoanApplicationRequest): Promise<LoanApplication> {
    return this.create<LoanApplication>(data);
  }

  async updateApplication(id: string, data: Partial<CreateLoanApplicationRequest>): Promise<LoanApplication> {
    return this.update<LoanApplication>(id, data);
  }

  async deleteApplication(id: string): Promise<void> {
    return this.delete(id);
  }
} 