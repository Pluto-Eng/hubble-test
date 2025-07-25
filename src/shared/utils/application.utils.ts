import { UserType } from '@/domains/auth/types';

// A simple display status formatter
export function getDisplayStatus(status: string): string {
  if (!status) return 'Unknown';
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// A simple permission check
export function canUserEditApplication(userType: UserType, application: any, userId: string): boolean {
  if (userType === 'admin' || userType === 'manager') {
    return true;
  }
  if (userType === 'individual' && application.borrowerId === userId) {
    return application.status === 'draft';
  }
  return false;
}
