// app/dashboard/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back{session.user.email ? `, ${session.user.email}` : ''}!
        </h2>
        <p className="text-gray-600">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Account Status</h3>
          <p className="text-3xl font-bold text-green-600">Active</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">User Type</h3>
          <p className="text-3xl font-bold text-blue-600 capitalize">
            {session.user.type || 'Individual'}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">User ID</h3>
          <p className="text-sm font-mono text-gray-600 break-all">
            {session.user.id}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-left transition-colors">
            <div className="text-blue-600 font-medium">View Profile</div>
            <div className="text-blue-500 text-sm">Manage your account</div>
          </button>

          <button className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-left transition-colors">
            <div className="text-green-600 font-medium">Applications</div>
            <div className="text-green-500 text-sm">View loan applications</div>
          </button>

          <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-left transition-colors">
            <div className="text-purple-600 font-medium">Documents</div>
            <div className="text-purple-500 text-sm">Upload documents</div>
          </button>

          <button className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-4 text-left transition-colors">
            <div className="text-orange-600 font-medium">Support</div>
            <div className="text-orange-500 text-sm">Get help</div>
          </button>
        </div>
      </div>
    </div>
  );
}