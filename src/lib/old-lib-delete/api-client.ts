// Consolidated API client - Domain-driven architecture
// This provides a clean interface for all domain operations

import { AuthClient } from './domains/auth';
import { AccountsClient } from './domains/accounts';
import { 
  LoanApplicationsClient, 
  LoanAssetsClient, 
  LoanIncomesClient, 
  LoansClient 
} from './domains/loans';
import { FilesClient } from './domains/files';
import { OrganizationsClient } from './domains/organizations';
import { UsersClient, UserProfileClient } from './domains/users';

export class ApiClient {
  // Authentication
  static auth(authToken?: string): AuthClient {
    return new AuthClient(authToken);
  }

  // Accounts
  static accounts(authToken?: string): AccountsClient {
    return new AccountsClient(authToken);
  }

  // Loans
  static loanApplications(accountId: string, authToken?: string): LoanApplicationsClient {
    return new LoanApplicationsClient(accountId, authToken);
  }

  static loanAssets(accountId: string, loanApplicationId: string, authToken?: string): LoanAssetsClient {
    return new LoanAssetsClient(accountId, loanApplicationId, authToken);
  }

  static loanIncomes(accountId: string, loanApplicationId: string, authToken?: string): LoanIncomesClient {
    return new LoanIncomesClient(accountId, loanApplicationId, authToken);
  }

  static loans(accountId: string, authToken?: string): LoansClient {
    return new LoansClient(accountId, authToken);
  }

  // Files
  static files(accountId: string, documentableId: string, authToken?: string): FilesClient {
    return new FilesClient(accountId, documentableId, authToken);
  }

  // Organizations
  static organizations(authToken?: string): OrganizationsClient {
    return new OrganizationsClient(authToken);
  }

  // Users
  static users(authToken?: string): UsersClient {
    return new UsersClient(authToken);
  }

  static userProfile(authToken?: string): UserProfileClient {
    return new UserProfileClient(authToken);
  }
}

// Export all domain types for convenience
export * from './domains';
export * from './shared/types';
export * from './shared/errors'; 