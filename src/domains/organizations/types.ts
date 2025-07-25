// Organization domain types
import { Organization as GeneratedOrganization } from '@/lib/charon-client/generated';

export interface Organization extends GeneratedOrganization {}

export interface CreateOrganizationRequest extends Partial<Organization> {}

export interface UpdateOrganizationRequest extends Partial<Organization> {}
