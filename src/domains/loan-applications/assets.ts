// Loan Assets API client
import { BaseApiClient } from '../../shared/api';
import { LoanAsset, CreateLoanAssetRequest } from './types';

export class LoanAssetsClient extends BaseApiClient {
  constructor(accountId: string, loanApplicationId: string, authToken?: string) {
    super(`/accounts/${accountId}/loan-applications/${loanApplicationId}/assets`, authToken);
  }

  async getAssets(params?: any): Promise<LoanAsset[]> {
    const response = await this.getAll<LoanAsset>(params);
    return response.data;
  }

  async getAsset(id: string): Promise<LoanAsset> {
    return this.getById<LoanAsset>(id);
  }

  async createAsset(data: CreateLoanAssetRequest): Promise<LoanAsset> {
    return this.create<LoanAsset>(data);
  }

  async updateAsset(id: string, data: Partial<CreateLoanAssetRequest>): Promise<LoanAsset> {
    return this.update<LoanAsset>(id, data);
  }

  async deleteAsset(id: string): Promise<void> {
    return this.delete(id);
  }
} 