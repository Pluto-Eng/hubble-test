// /*
// Super user = pluto credit admin
// Fund
// User
// */

// // lib/auth/rbac.js
// export const requireRole = (allowedRoles: string[]) => {
//   return async (req: NextRequest, handler: Function) => {
//     const token = await getToken({ req });

//     if (!token || !allowedRoles.includes(token.type)) {
//       return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
//     }

//     return handler(req, token);
//   };
// };

// // pages/api/admin/users.js
// export default async function handler(req, res) {
//   return requireRole(['admin', 'manager'])(req, async (req, token) => {
//     // Admin-only logic here
//     const users = await getUsersForOrganization(token.userId);
//     return res.json(users);
//   });
// }

// // pages/api/loans/approve.js
// export default async function handler(req, res) {
//   return requireRole(['manager', 'admin'])(req, async (req, token) => {
//     // Only managers can approve loans
//     const loanId = req.body.loanId;
//     await approveLoan(loanId, token.userId);
//     return res.json({ success: true });
//   });
// }

// // components/auth/RoleGuard.tsx
// interface RoleGuardProps {
//   allowedRoles: string[];
//   children: React.ReactNode;
//   fallback?: React.ReactNode;
// }

// export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
//   const { data: session } = useSession();

//   if (!session?.user?.type || !allowedRoles.includes(session.user.type)) {
//     return fallback || <div>Access denied</div>;
//   }

//   return <>{children}</>;
// }

// // Usage in components
// <RoleGuard allowedRoles={['admin', 'manager']}>
//   <AdminPanel />
// </RoleGuard>

// <RoleGuard allowedRoles={['individual']} fallback={<BusinessDashboard />}>
//   <PersonalDashboard />
// </RoleGuard>
