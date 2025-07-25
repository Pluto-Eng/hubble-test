import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { charonClient } from '@/lib/charon-client/charon-client';
import { getDisplayStatus, canUserEditApplication } from '@/shared/utils/application.utils';
import { UserType } from '@/domains/auth/types';

export async function GET(request: NextRequest, { params }: { params: { accountId: string } }) {
  const jwt = await auth();
  // const token = jwt?.user?.accessToken;
  const user = jwt?.user;

  // if (!token || !user) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  // RBAC check: In a real app, ensure user can access this account.
  // For now, we assume if they have an accountId, they can access it.

  try {
    // charonClient.setAccessToken(token);
    const response = await charonClient.loanApplication.getApplications();

    if (response.error) {
      return NextResponse.json({ error: response.error.message }, { status: response.error.statusCode || 500 });
    }

    const transformedData = response.result?.data.map((app: any) => ({
      ...app,
      displayStatus: getDisplayStatus(app.status),
      canEdit: canUserEditApplication(user?.type as UserType, app, user?.id || ''),
    }));

    return NextResponse.json({
      success: true,
      data: transformedData,
      meta: {
        total: response.result?.count,
      },
    });
  } catch (error) {
    console.error('Error fetching loan applications from Charon:', error);
    return NextResponse.json({ error: 'Failed to fetch loan applications' }, { status: 500 });
  }
}
