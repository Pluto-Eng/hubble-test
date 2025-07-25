// // app/admin/page.tsx
// import { auth } from '@/auth';
// import { redirect } from 'next/navigation';

// export default async function AdminPage() {
//   const session = await auth();

//   if (!session?.user || !['admin', 'manager'].includes(session.user.type)) {
//     redirect('/dashboard');
//   }

//   return <AdminContent />;
// }