import { LoanApplicationStatus } from '@/domains/loan-applications/types';

/**
 * Maps loan application status to the corresponding step number (1-5)
 */
export function getStepFromStatus(status: LoanApplicationStatus): number {
    switch (status) {
      case 'draft':
        return 1; // Document Upload
      case 'documents_uploaded':
        return 2; // Personal Info
      case 'personal_info_complete':
        return 3; // Submit Application
      case 'submitted':
      case 'under_review':
      case 'approved':
      case 'rejected':
        return 4; // Loan Terms
      case 'completed':
        return 5; // Contract
      case 'cancelled':
        return 1; // Back to start
      default:
        return 1;
    }
  }
  
  /**
   * Maps step number to the corresponding status
   */
  export function getStatusFromStep(step: number): LoanApplicationStatus {
    switch (step) {
      case 1:
        return 'draft';
      case 2:
        return 'documents_uploaded';
      case 3:
        return 'personal_info_complete';
      case 4:
        return 'submitted';
      case 5:
        return 'completed';
      default:
        return 'draft';
    }
  }
  
  /**
   * Determines if a step should be skipped based on current status
   */
  export function shouldSkipStep(currentStatus: LoanApplicationStatus, targetStep: number): boolean {
    const currentStep = getStepFromStatus(currentStatus);
    return currentStep > targetStep;
  }
  
  /**
   * Gets the next step based on current status
   */
  export function getNextStep(currentStatus: LoanApplicationStatus): number {
    const currentStep = getStepFromStatus(currentStatus);
    return Math.min(currentStep + 1, 5);
  }
  
  /**
   * Formats the status for display
   */
  export function formatLoanApplicationStatus(status: LoanApplicationStatus): string {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'documents_uploaded':
        return 'Documents Uploaded';
      case 'personal_info_complete':
        return 'Personal Info Complete';
      case 'submitted':
        return 'Submitted';
      case 'under_review':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }
  
  /**
   * Gets the appropriate badge variant for a status
   */
  export function getStatusBadgeVariant(status: LoanApplicationStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
      case 'draft':
      case 'documents_uploaded':
      case 'personal_info_complete':
        return 'outline';
      case 'submitted':
      case 'under_review':
        return 'secondary';
      case 'approved':
      case 'completed':
        return 'default';
      case 'rejected':
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  }
  