// Account domain types - extending generated Charon client types
import type { Account as GeneratedAccount } from '@/lib/charon-client/generated';


// Use generated types as the foundation
export interface Account extends GeneratedAccount {}

export interface CreateAccountRequest {
  nameFamily: string;
  nameGiven: string;
  nameMiddle?: string;
  email: string;
  phone?: string;
  secId?: string;
  type?: Account['type'];
}