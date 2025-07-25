import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ApplicationList } from '@/domains/loan-applications/components/user/ApplicationList';

export default async function DashboardPage() {
    const jwt = await auth();
    log.info('DashboardPage', 'jwt', jwt);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            {jwt?.user?.email || 'Loading...'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationList />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loan Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">
              No active loan contracts found.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}