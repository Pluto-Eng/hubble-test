import { Header } from '@/shared/components/layout/Header';
import { UserSidebar } from '@/shared/components/layout/UserSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}