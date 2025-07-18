import { Logger } from '@/lib/logger';

declare global {
  var log: Logger;
}

export {};

// Shared types used across multiple domains
export interface ApiResponse<T = any> {
  id: string;
  message: string;
  statusCode: number;
  data: T;
  count?: number;
}

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