'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { formatLoanApplicationDate } from '@/shared/utils/formatters';
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import type { LoanApplication } from '@/shared/types/loan.types';
import { useApplicationsData } from '@/domains/loan-applications/hooks/user/use-applications-data';

export function ApplicationList() {
  const router = useRouter();
  const { applications, isLoading, error } = useApplicationsData();

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800';

    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string | null | undefined) => {
    if (!status) return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;

    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'draft':
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-blue-600" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {applications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application: any) => (
            <Card
              key={application.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {application.name ||
                      `Application #${application.id.slice(0, 8)}`}
                  </CardTitle>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status || 'Unknown'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(application.status)}
                  <span className="text-sm text-gray-600">
                    {!application.status
                      ? 'Unknown'
                      : application.status === 'draft'
                        ? 'Draft'
                        : application.status === 'pending'
                          ? 'Under Review'
                          : application.status === 'approved'
                            ? 'Approved'
                            : application.status === 'rejected'
                              ? 'Rejected'
                              : application.status}
                  </span>
                </div>

                {application.loanAmount && (
                  <div>
                    <p className="text-sm text-gray-500">Loan Amount</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(
                        application.loanAmount,
                        application.loanCurrency
                      )}
                    </p>
                  </div>
                )}

                {application.employmentStatus && (
                  <div>
                    <p className="text-sm text-gray-500">Employment</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {application.employmentStatus.replace('-', ' ')}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-100 space-y-1">
                  <p className="text-xs text-gray-500">
                    Created:{' '}
                    {application.createdAt
                      ? formatLoanApplicationDate(application.createdAt)
                      : 'Unknown'}
                  </p>
                  {application.updatedAt &&
                    application.updatedAt !== application.createdAt && (
                      <p className="text-xs text-gray-500">
                        Updated:{' '}
                        {formatLoanApplicationDate(application.updatedAt)}
                      </p>
                    )}
                </div>

                <Button
                  onClick={() =>
                    router.push(
                      `/dashboard/new-loan/${application.id}/apply`
                    )
                  }
                  className="w-full"
                  variant={
                    application.status === 'draft' ? 'default' : 'outline'
                  }
                >
                  {application.status === 'draft'
                    ? 'Continue Application'
                    : 'View Details'}
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No loan applications yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first loan application to unlock
              liquidity using your alternative assets.
            </p>
            <Button onClick={() => router.push('/dashboard/new-loan')}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create New Application
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}