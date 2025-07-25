'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { LoanApplication } from '@/shared/types/loan.types';
import { loanApplicationsClient } from '@/domains/loan-applications';
import { useSession } from 'next-auth/react';

export function useApplicationsData() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(false);

      setIsLoading(true);
      setError(null);

      try {
        const result = await loanApplicationsClient.getApplications();
        setApplications(result.result?.data || []);
      } catch (err: any) {
        const errorMessage = err.message || 'An error occurred while fetching applications.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return { applications, isLoading, error };
}
