import { Logger } from '@/lib/logger';

if (typeof globalThis !== 'undefined') globalThis.log = log;
if (typeof window !== 'undefined') (window as any).log = log;
if (typeof global !== 'undefined') (global as any).log = log;
declare global {
  var log: Logger;
}

export {};

export interface PaginationParams {
  limit?: number;
  offset?: number;
  order?: string;
  fields?: string;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserContext {
  id: string;
  email: string;
  accountId?: string;
  type: 'individual' | 'manager' | 'admin';
}

export interface Currency {
  USD: 'USD';
  EUR: 'EUR';
  GBP: 'GBP';
  JPY: 'JPY';
  AUD: 'AUD';
  CAD: 'CAD';
  CHF: 'CHF';
  CNY: 'CNY';
  SEK: 'SEK';
  NZD: 'NZD';
}

export type CurrencyType = keyof Currency;
