// Organization domain types
import { BaseEntity } from '@/shared/types';

export interface Organization extends BaseEntity {
  name: string;
  type: 'admin' | 'client';
  status: 'active' | 'suspended';
  domain?: string;
  contactEmail?: string;
  contactName?: string;
  settings?: Record<string, any>;
  deletedAt?: string;
}

export interface CreateOrganizationRequest {
  name: string;
  type: Organization['type'];
  status?: Organization['status'];
  domain?: string;
  contactEmail?: string;
  contactName?: string;
  settings?: Record<string, any>;
}

export interface UpdateOrganizationRequest extends Partial<CreateOrganizationRequest> {} 