import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { LoanApplicationStatus } from '@/shared/types/loan.types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date with relative time and detailed information
 * @param dateString - ISO date string
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDateWithRelativeTime(
  dateString: string,
  options: {
    showRelative?: boolean;
    showTime?: boolean;
    showYear?: boolean;
  } = {}
): string {
  const { showRelative = true, showTime = true, showYear = true } = options;

  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Relative time formatting
  if (showRelative) {
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
  }

  // Detailed date formatting
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    ...(showYear && { year: 'numeric' }),
    ...(showTime && {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  };

  return date.toLocaleDateString('en-US', dateOptions);
}

/**
 * Get a more detailed date format for loan applications
 * @param dateString - ISO date string
 * @returns Formatted date string with time
 */
export function formatLoanApplicationDate(dateString: string): string {
  return formatDateWithRelativeTime(dateString, {
    showRelative: true,
    showTime: true,
    showYear: true,
  });
}

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
export function getStatusBadgeVariant(
  status: LoanApplicationStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
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
