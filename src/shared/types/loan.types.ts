export type LoanApplicationStatus =
  | 'draft'
  | 'documents_uploaded'
  | 'personal_info_complete'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export interface LoanApplication {
  id: string;
  name: string;
  status: LoanApplicationStatus;
  createdAt: string;
  // Add other fields from your API response as needed
}
