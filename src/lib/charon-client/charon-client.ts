import { ApiClient } from '@/lib/api-client';
import { api } from '@/lib/config';
import { AuthClient } from '@/domains/auth/client';
import { UserClient } from '@/domains/user/client';
import { UsersClient } from '@/domains/users/client';
import { AccountsClient } from '@/domains/accounts/client';
import { OrganizationsClient } from '@/domains/organizations/client';
import { LoanApplicationsClient } from '@/domains/loan-applications/client';
import { LoanAssetsClient } from '@/domains/loan-applications/assets';
import { LoanIncomesClient } from '@/domains/loan-applications/incomes';
import { LoansClient } from '@/domains/loans/client';
import { FilesClient } from '@/domains/files/client';
import { SigningClient } from '@/domains/signing/client';

export class CharonClient {
  private api: ApiClient;

  auth: AuthClient;
  user: UserClient;
  account: AccountsClient;
  users: UsersClient;
  organizations: OrganizationsClient;
  loanApplication: LoanApplicationsClient;
  loanAssets: LoanAssetsClient;
  loanIncomes: LoanIncomesClient;
  loans: LoansClient;
  files: FilesClient;
  signing: SigningClient;

  constructor() {
    // this.api = new ApiClient('charonClient', api.baseUrl);

    this.auth = new AuthClient(api.baseUrl);
    this.user = new UserClient(api.baseUrl);
    this.users = new UsersClient(api.baseUrl);
    this.account = new AccountsClient(api.baseUrl);
    this.organizations = new OrganizationsClient(api.baseUrl);
    this.loanApplication = new LoanApplicationsClient(api.baseUrl);
    this.loanAssets = new LoanAssetsClient(api.baseUrl);
    this.loanIncomes = new LoanIncomesClient(api.baseUrl);
    this.loans = new LoansClient(api.baseUrl);
    this.files = new FilesClient(api.baseUrl);
    this.signing = new SigningClient(api.baseUrl);
  }
}

export const charonClient = new CharonClient();
