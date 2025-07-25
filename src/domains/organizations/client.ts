// Organizations API client
import { ApiClient } from '@/lib/api-client';
import { Organization, CreateOrganizationRequest, UpdateOrganizationRequest } from './types';

export class OrganizationsClient extends ApiClient {
  constructor(baseUrl: any = 'api/proxy/') {
    super('organizations', baseUrl);
  }

  async getOrganizations() {
    return this.get<Organization>('/organizations');
  }

  async getOrganization(id: string) {
    return this.get<Organization>(`/organizations/${id}`);
  }

  async createOrganization(data: CreateOrganizationRequest) {
    return this.post<Organization>(`/organizations`, data);
  }

  async updateOrganization(id: string, data: UpdateOrganizationRequest) {
    return this.put<Organization>(`/organizations/${id}`, data);
  }

  async deleteOrganization(id: string) {
    return this.delete(`/organizations/${id}`);
  }
}

export const organizationsClient = new OrganizationsClient();
