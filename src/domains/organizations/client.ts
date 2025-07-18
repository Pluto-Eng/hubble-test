// Organizations API client
import { ApiClient } from '@/lib/api-client';
import { Organization, CreateOrganizationRequest, UpdateOrganizationRequest } from './types';

export class OrganizationsClient extends ApiClient {
  constructor(authToken?: string) {
    super('organizations', '/organizations', authToken);
  }

  async getOrganizations(params?: any): Promise<Organization[]> {
    const response = await this.getAll<Organization>(params);
    return response.data;
  }

  async getOrganization(id: string): Promise<Organization> {
    return this.getById<Organization>(id);
  }

  async createOrganization(data: CreateOrganizationRequest): Promise<Organization> {
    return this.create<Organization>(data);
  }

  async updateOrganization(id: string, data: UpdateOrganizationRequest): Promise<Organization> {
    return this.update<Organization>(id, data);
  }

  async deleteOrganization(id: string): Promise<void> {
    return this.delete(id);
  }
} 