// Loan Assets API client
import { ApiClient } from '@/lib/api-client';
import { LoanAsset, CreateLoanAssetRequest } from './types';

export class LoanAssetsClient extends ApiClient {
  constructor(baseUrl: any = 'api/proxy/') {
    super('loan-assets', baseUrl);
  }

  async getAssets() {
    return this.get<LoanAsset>('/loan-assets');
  }

  async getAsset(id: string) {
    return this.get<LoanAsset>(`/loan-assets/${id}`);
  }

  async createAsset(data: CreateLoanAssetRequest) {
    return this.post<LoanAsset>(`/loan-assets`, data);
  }

  async updateAsset(id: string, data: Partial<CreateLoanAssetRequest>) {
    return this.put<LoanAsset>(`/loan-assets/${id}`, data);
  }

  async deleteAsset(id: string) {
    return this.delete(`/loan-assets/${id}`);
  }
}

export const loanAssetsClient = new LoanAssetsClient();
