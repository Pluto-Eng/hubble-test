'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Manage Loans', href: '/dashboard/loan-management' },
  { name: 'View Profile', href: '/dashboard/profile' },
];

export function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateLoanApplication = async () => {
    setIsCreating(true);
    try {
      // This will be a server action call
      // const newLoanAppId = await createLoanApplicationAction();
      // For now, let's mock this
      const newLoanAppId = 'new-app-id';
      toast.success('New loan application created!');
      router.push(`/dashboard/new-loan/${newLoanAppId}/apply`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'An unknown error occurred.'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white p-6">
      <nav className="space-y-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Navigation
        </h2>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm font-medium ${
                pathname === item.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleCreateLoanApplication}
            disabled={isCreating}
            className="block w-full text-left rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            {isCreating ? 'Creating...' : 'New Loan Application'}
          </button>
        </div>
        <div>
          <button
            onClick={handleSignOut}
            className="block w-full text-left rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>
      </nav>
    </aside>
  );
}