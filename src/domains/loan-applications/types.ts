// Loan domain types - extending generated Charon client types
import { BaseEntity, CurrencyType } from '@/shared/types/global';
import type { 
  LoanApplication as GeneratedLoanApplication,
  LoanAsset as GeneratedLoanAsset,
  LoanIncome as GeneratedLoanIncome,
} from '@/lib/charon-client/generated';


// Use generated types as the foundation, extending only when needed
export interface LoanApplication extends GeneratedLoanApplication {}

export interface LoanAsset extends GeneratedLoanAsset {}

export interface LoanIncome extends GeneratedLoanIncome {}

// Request/Response types for domain operations
export interface CreateLoanApplicationRequest {
  name: string;
  employmentStatus?: LoanApplication['employmentStatus'];
  incomeTotalAmount?: number;
  incomeTotalCurrency?: LoanApplication['incomeTotalCurrency'];
  assetTotalValue?: number;
  assetTotalCurrency?: LoanApplication['assetTotalCurrency'];
  loanAmount?: number;
  loanCurrency?: LoanApplication['loanCurrency'];
  loanInterestRate?: number;
  loanInterestPeriod?: LoanApplication['loanInterestPeriod'];
  openDate?: string;
  closeDate?: string;
}

export interface CreateLoanAssetRequest {
  fund: string;
  investor: string;
  phone: string;
  dateOrigin: string;
  units: number;
  unitsPledged: number;
  unitsCalled: number;
  unitsInvested: number;
  unitValue: number;
  unitCurrency: CurrencyType;
}

export interface CreateLoanIncomeRequest {
  phone: string;
  name: string;
  amount: number;
  currency: CurrencyType;
  year: number;
  period: LoanIncome['period'];
}

export interface Contract {
  signed: boolean;
  signedAt?: Date;
}

export interface StoredDocument {
  name: string;
  type: 'subscription' | 'pcap' | 'earnings' | 'other' | 'pending';
  downloadUrl: string;
  storagePath: string;
  documentAnalysis?: any;
  analysisResult?: any;
  result?: any;
  extractedText?: string;
  status?: 'uploading' | 'processing' | 'complete' | 'error' | 'deleted';
}

export type PledgedAsset = {
  fundName: string;
  symbol: string;
  type: 'pcap' | 'subscription';
  value: number;
  status: 'pledged' | 'not_pledged';
  quantity?: number;
  hasBeenInteractedWith?: boolean;
};

export interface LoanData {
  documents: StoredDocument[];
  decisioningDocs?: Array<{
    name: string;
    downloadUrl: string;
    storagePath: string;
    uploadedAt: Date;
    type: 'decisioning_support';
  }>;
  selectedFunds: Array<{
    id: string;
    name: string;
    type: string;
    value: number;
    maxLTV: number;
  }>;
  personalInfo: {
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phoneNumber?: string;
    employmentStatus?: string;
    annualIncome?: string;
  };
  loanTerms: {
    spreadRate?: number; // The spread above SOFR
    loanAmount?: number;
    term?: number;
    ltv?: number;
    paymentFrequency?: string;
    disbursementDetails?: {
      accountNumber: string;
      routingNumber: string;
      accountType: 'checking' | 'savings';
      recipientName: string;
    };
  };
  pledgedAssets: PledgedAsset[];
  contract: Contract | null;
  offer?: {
    maxLoanSize: number;
    spreadRate: number; // The spread above SOFR
    maxLVR: number;
    term: number; // Loan term in months
    paymentTerms: 'monthly_interest_principal_maturity' | 'amortized_interest_principal_maturity';
  };
}

export type LoanStatus =
  | 'incomplete'
  | 'not_submitted'
  | 'pending_approval'
  | 'offer_made'
  | 'offer_accepted'
  | 'complete'
  | 'deleted';

export type ApplicationStatus = LoanStatus | 'incomplete' | 'complete' | 'deleted';

// New status tracking for loan applications
export type LoanApplicationStatus = 
  | 'draft'                    // Initial state when created
  | 'documents_uploaded'       // Documents have been uploaded
  | 'personal_info_complete'   // Personal information has been filled out
  | 'submitted'                // Application has been submitted for review
  | 'under_review'             // Application is being reviewed
  | 'approved'                 // Application has been approved
  | 'rejected'                 // Application has been rejected
  | 'completed'                // Loan has been finalized
  | 'cancelled';               // Application was cancelled

export interface LoanApplicationWithStatus {
  id: string;
  name: string;
  status: LoanApplicationStatus;
  currentStep: number; // 1-5 based on the application steps
  createdAt: string;
  updatedAt: string;
  // ... other loan application fields
}

export interface LoanApplication {
  Id: number;
  Borrower: number;
  Status: string;
  OpenDate: Date;
  Name: string;
  Address?: number;
  EmploymentStatus?: 'EMPLOYED' | 'UNEMPLOYED' | 'SELF_EMPLOYED' | 'RETIRED';
  IncomeAmount?: number;
  IncomeCurrency?: string;
  AssetAmount?: number;
  AssetCurrency?: string;
  LoanRefDocs?: LoanRefDoc[];
  LoanTerms?: LoanTerm[];
}

export interface LoanRefDoc {
  Id: number;
  LoanApp: number;
  FileName: string;
  FileLocation: string;
  UploadDate: Date;
  ProcStatus: 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  DocType: 'W-2' | '1099' | 'Investment Statement';
  Meta?: string;
}

export interface LoanTerm {
  Id: number;
  LoanApp: number;
  Servicer?: number;
  Provider?: number;
  Amount?: number;
  Currency?: 'USD' | 'EUR';
  InterestRate?: number;
  InterestPeriod?: string;
}

export interface SofrSettings {
  rate: number;
  lastUpdated: Date;
}

export interface LoanTerms {
  spreadRate?: number; // The spread above SOFR
  loanAmount?: number;
  term?: number;
  ltv?: number;
  paymentFrequency?: string;
  disbursementDetails?: {
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
    recipientName: string;
  };
}

export interface LoanOffer {
  maxLoanSize: number;
  spreadRate: number; // The spread above SOFR
  maxLVR: number;
  term: number; // Loan term in months
  paymentTerms: 'monthly_interest_principal_maturity' | 'amortized_interest_principal_maturity';
}

export interface LoanContract {
  // 1. Loan Identification
  loan_id: string;
  loan_type: string;
  loan_purpose: string;
  loan_structure: string;

  // 2. Borrower & Lender Information
  borrower_firstname: string;
  borrower_lastname: string;
  borrower_type: string;
  lender_id: string;
  lender_name: string;

  // 3. Loan Terms
  principal_amount: number;
  current_balance: number; // New field: Current outstanding balance including accrued interest
  currency: string;
  interest_rate_spread: number;
  base_rate: number;
  lvr: number;
  loan_term_months: number;
  origination_date: Date;
  maturity_date: Date;
  payment_frequency: string;
  prepayment_penalty: number;
  late_payment_fee: number;
  grace_period_days: number;
  interest_calculated_last_date: Date; // New field: Last date interest was calculated
  interest_payment_structure: 'monthly_payment' | 'amortized_at_maturity'; // New field: How interest is paid

  // 4. Asset & Collateral Information
  collateral_id: string;
  collateral_type: string;
  collateral_description: string;
  collateral_valuation_method: string;
  collateral_valuation_date: Date;
  collateral_value: number;
  collateral_location: string;
  collateral_ownership_status: string;
  lien_position: string;
  lien_filing_reference: string;
  ucc_filing_date: Date;
  ltv_ratio: number;
  collateral_insurance_status: string;
  insurance_provider: string;
  insurance_expiry_date: Date;
  collateral_assets: Array<{
    fund_name: string;
    value: number;
    pledged_date: Date;
    status: 'active' | 'released' | 'defaulted';
  }>;

  // 5. Repayment & Loan Monitoring
  outstanding_balance: number;
  next_payment_due_date: Date;
  last_payment_date: Date;
  payment_status: string;
  covenants_status: string;
  collateral_status: string;
  default_trigger_event: string;
  default_recourse_action: string;
  repayment_source: string;

  // 6. Legal & Compliance
  jurisdiction: string;
  contract_signed_date: Date;
  contract_status: string;
  disbursement_date: Date;
  disbursement_method: string;
  loan_covenants: string[];
  default_provisions: string[];
  secured_party_name: string;

  // 7. Additional Fields
  notes: string;
  uploaded_documents: string[];
  modified_by: string;
  modified_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface PreApprovedAsset {
  id: string;
  name: string;
  identifier: string; // CUSIP or other unique identifier
  spreadRate: number;
  maxLVR: number;
  autoApprove: boolean;
  createdAt: Date;
  updatedAt: Date;
  justificationDoc?: {
    name: string;
    downloadUrl: string;
    storagePath: string;
    uploadedAt: Date;
  };
}
