// Loan domain types - extending generated Charon client types
import { BaseEntity, CurrencyType } from '@/shared/types/global';
import type { 
  Loan as GeneratedLoan
} from '@/lib/charon-client/generated';

export interface Loan extends GeneratedLoan {}

export interface CreateLoanRequest {
    name: string;
    loanApplicationId: string;
    status?: Loan['status'];
    balanceOpen: number;
    balanceCurrent: number;
    currency: CurrencyType;
    dateOpen: string;
    dateClose?: string;
  }
  