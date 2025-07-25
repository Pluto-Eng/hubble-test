# Pluto Credit Hubble Platform

A fintech platform for loan applications built with Next.js 14, featuring user and admin dashboards, document processing, and automated approval workflows.

## 🏗️ Architecture Overview

This application follows a **domain-driven design** with **route groups** for clear separation of concerns:

- **User Dashboard**: Loan application workflows, document management, profile management
- **Admin Dashboard**: User management, application review, analytics, system settings
- **Shared Components**: Reusable UI components and utilities
- **Domain-Driven Structure**: Organized by business domains (auth, users, loan-applications, etc.)

## 🚀 Features

### User Features

- **Secure Authentication** with AWS Cognito via Auth.js v5 (formerly NextAuth but latest version)
- **Multi-step Loan Application** process with progress tracking
- **Smart Document Upload** with AI-powered parsing (OpenAI → External API transition)
- **Real-time Status Updates** and notifications
- **Document Signing** integration with SignWell
- **Responsive Design** optimized for mobile and desktop

### Admin Features

- **User Management** with role-based access control
- **Application Review** with approval/rejection workflows
- **Analytics Dashboard** with real-time metrics
- **Bulk Operations** for efficient application processing
- **Compliance Reporting** and audit trails
- **System Configuration** and integration management

### External Backend Charon API Features

- **Database Integration** with AWS RDS
- **File Upload** to AWS S3

## 📁 Project Structure

**Implications for RBAC:**

- **User Role (Individual):** When an individual user logs in, their `session.user.id` is their `User` ID. When they try to access `accounts/{id}`, `loan-applications/{id}`, `loans/{id}`, etc., the authorization logic must check if the `id` in the URL/payload corresponds to an `Account` that _their_ `User` ID is linked to.
- **Broker Admin/Fund Role:** These roles are likely associated with `Organizations`. Their permissions would be scoped to `Accounts` and `Users` that belong to or are managed by _their_ `Organization`. This requires additional lookup logic: `session.user.organizationId` (if stored in session) -\> fetch `accounts` linked to that `organizationId`.

**Refinement for `admin/users` & `admin/accounts` API routes:**
The `api/proxy/admin/users/[userId]/route.ts` will need to differentiate between `master-admin` (can edit any user) and `broker-admin` (can only edit users linked to their org/accounts). This is precisely where the role check within the API route handler or server action is paramount.

```sh
hubble-nextjs/
├──   src/
|     ├── app/                                  # Next.js App Router -> routes and pages
|     |   ├── api/                              # API routes (proxy/backend integration)
|     |   │   ├── auth/[...nextauth]/route.ts   # Auth.js route handlers
|     |   │   ├── proxy/                        # Token-protected internal proxies
|     |   │   │   ├── accounts/                                # /accounts
|     |   │   │   │   ├── route.ts                             # GET/POST /accounts
|     |   │   │   │   ├── [accountId]/
|     |   │   │   │   │   ├── route.ts                         # GET/PATCH/DELETE specific account
|     |   │   │   │   │   ├── loans/                           # /accounts/{id}/loans
|     |   │   │   │   │   │   ├── route.ts                     # GET/POST existing loans
|     |   │   │   │   │   │   └── [loanId]/route.ts            # GET/PATCH/DELETE specific existing loan
|     |   │   │   │   │   ├── loan-applications/               # /accounts/{id}/loan-applications
|     |   │   │   │   │   │   ├── route.ts                     # GET/POST loan apps
|     |   │   │   │   │   │   └── [loanAppId]/
|     |   │   │   │   │   │   │   ├── route.ts                 # GET/PATCH/DELETE specific loan application
|     |   │   │   │   │   │   │   ├── assets/                  # /accounts/{id}/loan-applications/{loanAppid}/assets
|     |   │   │   │   │   │   │   │   ├── route.ts             # GET/POST a loan app's assets
|     |   │   │   │   │   │   │   │   └── [assetId]/route.ts   # GET/PATH/DELETE specific loan app asset
|     |   │   │   │   │   │   │   ├── incomes/                 # /accounts/{id}/loan-applications/{loanAppid}/incomes
|     |   │   │   │   │   │   │   │   ├── route.ts             # GET/POST a loan app's incomes
|     |   │   │   │   │   │   │   │   └── [incomeId]/route.ts  # GET/PATH/DELETE specific loan app income
|     |   │   │   │   │   │   └── [documentableId]/
|     |   │   │   │   │   │       └── files/                   # /accounts/{id}/loan-applications/{documentableId}/files
|     |   │   │   │   │   │           ├── route.ts             # GET/POST a loan app's fileRefs
|     |   │   │   │   │   │           └── [fileId]/
|     |   │   │   │   │   │               ├── route.ts          # GET/PATCH/DELETE specific loan app file
|     |   │   │   │   │   │               └── download/route.ts # GET specific loan app file for download
|     |   │   │   ├── organizations/                            # /organizations
|     |   │   │   │   ├── route.ts                              # GET/POST organizations
|     |   │   │   │   └──[organizationId]/route.ts              # GET/PUT/DELETE specific organization
|     |   │   │   ├── admin/                                    # /admin
|     |   │   │   │   └──users/                                 # /admin/users
|     |   │   │   │   │   ├── route.ts                          # GET/POST users under admin
|     |   │   │   │   │   └── [userId]/route.ts                 # GET/PATCH/DELETE specific user under admin
|     |   │   │   ├── user/                                     # /user/
|     |   │   │       └── profile/route.ts                      # GET/PUT user profiles
|     │   ├── (auth)/                                           # Public auth pages/routes
|     │   │   ├── login/page.tsx
|     │   │   ├── register/page.tsx
|     │   │   └── confirm/page.tsx
|     │   ├── (user)/                                       # User dashboard
|     │   │   ├── dashboard/
|     │   │   │   ├── files/page.tsx                    # statements, uploaded docs, contracts, etc
|     │   │   │   ├── loan-applications/
|     │   │   │   │   ├── [id]/                             # wizard steps after creating new loan application
|     │   │   │   │   │   ├── apply/page.tsx                # Start new application + upload documents
|     │   │   │   │   │   ├── personal-info/page.tsx        # Review parsed data
|     │   │   │   │   │   ├── contract/page.tsx             # Choose loan terms
|     │   │   │   │   │   ├── submit/page.tsx               # Final submission
|     │   │   │   │   │   ├── sign/page.tsx                 # Sign documents
|     │   │   │   │   │   ├── terms/page.tsx                # Loan Disclaimer
|     │   │   │   │   │   ├── success/page.tsx
|     │   │   │   │   ├── layout.tsx                        # List loan applications
|     │   │   │   │   └── page.tsx                          # View existing loan app
|     │   │   │   ├── profile/page.tsx
|     │   │   │   ├── layout.tsx
|     │   │   │   └── page.tsx                              # View all loans + applications
|     │   ├── (admin)/                                      # Admin dashboard
|     │   │   ├── dashboard/
|     │   │   │   ├── accounts/
|     │   │   │   │   ├── page.tsx
|     │   │   │   │   └── [id]/page.tsx
|     │   │   │   ├── organizations/
|     │   │   │   │   ├── page.tsx
|     │   │   │   │   └── [id]/page.tsx
|     │   │   │   ├── loans/
|     │   │   │   │   ├── page.tsx           # See all active loans
|     │   │   │   │   └── [id]/page.tsx
|     │   │   │   ├── loan-applications/
|     │   │   │   │   ├── page.tsx           # See all loan applications in progress
|     │   │   │   │   ├── pending/
|     │   │   │   │   │   └── [id]/page.tsx  # Manually approve or reject specific application
|     │   │   │   ├── users/
|     │   │   │   │   ├── page.tsx          # User management
|     │   │   │   │   └── [id]/page.tsx     # User detail
|     │   │   │   ├── settings
|     │   │   │   │   ├── page.tsx
|     │   │   │   │   └── approval/
|     │   │   │   │   │   └── page.tsx      # Update approval terms page
|     │   │   │   ├── layout.tsx
|     │   │   │   └── page.tsx
|     │   ├── globals.css                   # Global styles
|     │   ├── layout.tsx                    # Root layout
|     │   └── page.tsx                      # Landing page
|     │
|     ├── domains/                    # Core business logic organized by feature domain
|     │   ├── auth/                   # Authentication-related components, hooks, and logic
|     │   │   ├── components/         # Uses Charon endpoints -> /user/register, /user/confirm, /user/login, /user/logout, /user/
|     │   │   │   ├── LoginForm.tsx   # Invokes `authClient.login` (from client.ts)
|     │   │   │   └── SignupForm.tsx  # Invokes `authClient.register` (from client.ts)
|     │   │   ├── client.ts           # CLIENT-SIDE: Provides wrappers for Auth.js client functions (`signIn`, `signOut`) and calls Server Actions for registration/confirmation. SERVER-SIDE: Contains the actual business logic for interacting with Charon's auth endpoints (`/user/register`, `/user/confirm`). This is also where Auth.js's `authorize` and `jwt` callbacks will call Charon for login/refresh.
|     │   │   ├── types.ts            # Extend/reuse the generated Charon types, plus any internal auth-related types
|     │   │   ├── validation.ts       # Zod schema validation
|     │   │   └── index.ts            # Barrel file for exports, also serves as each domain's utils file
|     │   ├── user/                   # Individual user profile (for logged-in user to manage their own data)
|     │   │   ├── components/
|     │   │   │   └── ProfileForm.tsx # Invokes user/profile server action
|     │   │   ├── hooks/              # Runs on client only to encapsulate UX logic (state, effects, component interactivity)
|     │   │   │   ├── useUserData.tsx
|     │   │   │   └── useProfileForm.ts
|     │   │   ├── client.ts
|     │   │   ├── types.ts
|     │   │   ├── validation.ts
|     │   │   └── index.ts
|     │   ├── users/                  # Users management (for admin/manager roles to manage OTHER users)
|     │   │   ├── components/
|     │   │   │   ├── UsersList.tsx
|     │   │   ├── hooks/
|     │   │   │   ├── useUsersData.tsx
|     │   │   ├── client.ts
|     │   │   ├── types.ts
|     │   │   ├── validation.ts
|     │   │   └── index.ts
|     │   ├── accounts/                 # Financial accounts: components, hooks, and client logic. Note: These are financial accounts created upon new loan applications, distinct from user profiles for admins to control
|     │   │   ├── components/
|     │   │   │   ├── AccountList.tsx
|     │   │   │   ├── AccountForm.tsx
|     │   │   │   └── AccountProfile.tsx
|     │   │   ├── hooks/
|     │   │   │   ├── useAccountData.tsx
|     │   │   │   └── useAccountForm.ts
|     │   │   ├── client.ts
|     │   │   ├── types.ts
|     │   │   ├── validation.ts
|     │   │   └── index.ts
|     │   ├── organizations/
|     │   │   ├── components/
|     │   │   │   ├── OrganizationList.tsx
|     │   │   │   ├── OrganizationForm.tsx
|     │   │   ├── hooks/
|     │   │   │   └── useOrganizationData.tsx
|     │   │   ├── client.ts
|     │   │   ├── types.ts
|     │   │   ├── validation.ts
|     │   │   └── index.ts
|     │   ├── loans/                    # Active loans: components, hooks, and client logic
|     │   │   ├── components/
|     │   │   │   ├── LoanList.tsx
|     │   │   │   ├── LoanDetails.tsx
|     │   │   │   └── PaymentForm.tsx
|     │   │   ├── hooks/
|     │   │   │   └── useLoanData.tsx
|     │   │   ├── client.ts
|     │   │   ├── types.ts
|     │   │   ├── validation.ts
|     │   │   └── index.ts
|     │   ├── loan-applications/           # Loan application lifecycle (wizard, documents, assets, incomes, files): components, hooks, and client logic
|     │   │   ├── components/                        # Wizard, upload, review
|     │   │   │   ├── user/                          # User workflow components
|     │   │   │   │   ├── ApplicationWizard.tsx      # Multi-step wizard keeping track of status across prcoess
|     │   │   │   │   ├── DocumentUploader.tsx       # Document upload UI
|     │   │   │   │   ├── DataReviewForm.tsx       # review Personal details from parsing
|     │   │   │   │   ├── ApplicationSummary.tsx     # Pre-submission coontract review
|     │   │   │   │   ├── SigningInterface.tsx       # SignWell integration
|     │   │   │   │   ├── ApplicationList.tsx        # User's applications on dashboard
|     │   │   │   └── admin/                         # Admin workflow components
|     │   │   │       ├── ApplicationReview.tsx      # Review interface
|     │   │   │       ├── ApprovalInterface.tsx      # Approval controls
|     │   │   │       ├── RejectionInterface.tsx     # Rejection workflow
|     │   │   │       ├── BulkActions.tsx            # Batch operations
|     │   │   ├── hooks/
|     │   │   │   ├── user/
|     │   │   │   │   ├── useApplicationWizard.ts       # Wizard state management
|     │   │   │   │   ├── useDocumentUpload.ts          # Upload handling
|     │   │   │   │   ├── useDataParsing.ts             # Parsing workflow
|     │   │   │   │   ├── useApplicationSubmission.ts   # Submission flow
|     │   │   │   │   ├── useAssetManagement.ts
|     │   │   │   │   └── useIncomeManagement.ts
|     │   │   │   └── admin/
|     │   │   │       ├── useApplicationReview.ts       # Review workflow
|     │   │   │       ├── useApprovalWorkflow.ts        # Approval process
|     │   │   │       ├── useBulkOperations.ts          # Batch operations
|     │   │   ├── client.ts                             # Domain-specific API client
|     │   │   ├── assets.ts                             # Asset sub-client
|     │   │   ├── income.ts                             # Income sub-client
|     │   │   ├── files.ts                              # Files sub-client
|     │   │   ├── types.ts
|     │   │   ├── validation.ts
|     │   │   └── index.ts
|     │   ├── files/                               # Generic document management (viewing, uploading, parsing)
|     │   │   ├── components/
|     │   │   │   ├── DocumentUploader.tsx             # Document upload UI
|     │   │   │   ├── DocumentViewer.tsx
|     │   │   │   └── DocumentList.tsx
|     │   │   └── hooks/
|     │   │   │   ├── useDocumentUpload.ts
|     │   │   │   └── useDocumentParsing.ts
|     │   │   ├── hooks/
|     │   │   ├── client.ts                    # Handles integration with CharonAPI and OpenAI
|     │   │   ├── types.ts
|     │   │   ├── validation.ts
|     │   │   └── index.ts
|     │   ├── signing/                         # Digital signing functionalities (e.g., SignWell integration)
|     │   │   ├── components/
|     │   │   │   ├── SigningInterface.tsx     # Embedded signing
|     │   │   │   ├── SignatureStatus.tsx      # Status tracking
|     │   │   │   └── DocumentPreview.tsx      # Pre-signing preview
|     │   │   └── hooks/
|     │   │   │   ├── useSigning.ts            # Signing workflow
|     │   │   │   └── useSigningStatus.ts      # Status tracking
|     │   │   ├── client.ts                    # Handles integration with Charon API and SignWell API
|     │   │   ├── types.ts
|     │   │   ├── validation.ts
|     │   │   └── index.ts
|     │
|     ├── actions/                  # Server-side functions for handling form submissions and data mutations -> Essentially a remote procedure call from the client to the server, under the hood making a POST request
|     │   ├── auth/                        # Invokes /auth domain client to post to Charon
|     │   │   ├── user/
|     │   │   │   ├── login.ts               # User login form
|     │   │   │   ├── register.ts            # Create account form
|     │   │   │   └── update.ts              # User profile updates form
|     │   ├── users/
|     │   │   └── admin/
|     │   │       └── manage-users.ts         # Admin user management form
|     │   │   │   └── create-user.ts          # Create user form by admin
|     │   ├── accounts/
|     │   │   └── admin/
|     │   │       ├── create-user.ts          # Create account form by admin
|     │   │       ├── update-user.ts          # Admin accounts management form
|     │   │       └── delete-user.ts
|     │   ├── organizations/
|     │   │   ├── admin/
|     │   │   │   └── manage-organizations.ts    # Organization management form
|     │   ├── loans/
|     │   │   ├── user/
|     │   │   │   └── manage-loans.ts            # User update loans form
|     │   │   └── admin/
|     │   │       └── manage-loans.ts            # Admin loan management form
|     │   ├── loan-applications/
|     │   │   ├── user/
|     │   │   │   ├── create-application.ts       # New application
|     │   │   │   ├── update-application.ts       # Application updates
|     │   │   │   ├── submit-application.ts       # Final submission
|     │   │   │   ├── upload-documents.ts         # Document uploads
|     │   │   │   ├── cancel-application.ts       # Application cancellation
|     │   │   │   ├── manage-assets.ts
|     │   │   │   ├── manage-incomes.ts
|     │   │   │   └── manage-files.ts
|     │   │   └── admin/
|     │   │       ├── approve-application.ts       # Application approval
|     │   │       ├── reject-application.ts        # Application rejection
|     │   │       ├── request-additional-info.ts   # Request additional info
|     │   │       ├── update-loan-terms.ts         # Batch operations
|     │   │       └── reassign-application.ts      # Reassign to different
|     │   ├── files/
|     │   │   ├── upload-documents.ts
|     │   │   ├── parse-document.ts
|     │   │   ├── validate-parsing.ts
|     │   ├── signing/
|     │   │   ├── initiate-signing.ts
|     │   │   ├── complete-signing.ts
|     │   │   ├── cancel-signing.ts
|     │   │
|     ├── shared/                         # Shared building blocks
|     │   ├── components/                 # Higher-order reusable components
|     │   │   ├── ui/                     # Reusable low-level UI (auto-generated by shadcn installs)
|     │   │   │   ├── button.tsx
|     │   │   │   ├── card.tsx
|     │   │   │   ├── badge.tsx
|     │   │   │   ├── input.tsx
|     │   │   │   ├── button.tsx
|     │   │   │   ├── label.tsx
|     │   │   │   ├── progress.tsx
|     │   │   │   ├── select.tsx
|     │   │   │   ├── modal.tsx
|     │   │   │   ├── form.tsx
|     │   │   │   ├── table.tsx
|     │   │   │   └── ...
|     │   │   ├── layout/                     # Reusable low-level UI (auto-generated by shadcn installs)
|     │   │   │   ├── Header.tsx                 # App header
|     │   │   │   ├── UserSidebar.tsx            # User dashboard navigation
|     │   │   │   ├── AdminSidebar.tsx           # Admin dashboard navigation
|     │   │   │   └── Footer.tsx                 # Page footer
|     │   │   ├── ErrorBoundary.tsx          # Error behavior for catching client-side React errors
|     │   │   ├── LoadingSpinner.tsx         # Suspense loading spinner
|     │   │   └── FileDropzone.tsx           # Documents dropzone for upload
|     │   ├── hooks/                         # Generic, reusable React hooks
|     │   │   ├── useDebounce.ts
|     │   │   ├── useLocalStorage.ts
|     │   │   └── useAsyncOperation.ts       # For managing loading states, errors, and data from async operations
|     │   ├── types/                         # Global shared TypeScript types
|     │   │   ├── parse-address.d.ts
|     │   │   └── global.d.ts
|     │   ├── utils/                     # Generic utilities related to UI
|     │   │   ├── date-formatter.ts      # Date formatting with relative time
|     │   │   ├── status-formatter.ts    # loan application status formatters if needed
|     │   └── providers/                 # React context providers
|     │
|     ├── lib/                        # Core helpers, configurations, and external client integrations
|     │   ├── utils.ts                # Utility file (auto-generated by Tailwind)
|     │   ├── config.ts               # Environment variable access
|     │   ├── logger.ts               # Custom application logging (no libraries being used)
|     │   ├── error-handler.ts        # Standardized server-side error handling
|     │   ├── api-client.ts           # Base HTTP client for external APIs to be extended upon by domain clients
|     │   ├── rbac.ts                 # Permission + role definitions + guards
|     │   └── charon-client/          # Auto-generated client for the Charon API
|     │       ├── generated/
|     │       │   ├── core/
|     │       │   ├── models/
|     │       │   ├── services/
|     │       │   ├── index.ts
|     │       ├── charon-client.ts
|     │       └── CharonAPI.ts
|     ├── auth.ts                     # Auth.js v5+ instance
|     ├── auth.config.ts              # Auth.js specific configuration (providers, callbacks)
|     └── middleware.ts               # Global route protection & role-based access checks (Master Admin, Balance Sheet aka Broker Admin, User Role, Fund Role)
├── public/                           # Static assets served directly by Next.js
│   └── favicon.icon
│
├── config/                           # Static UI text (titles, labels, messages) and configuration files
│   ├── copy/                         # UI text for various section
│   │   ├── loan-application.ts       # Specific language for each loan app step
│   │   ├── dashboard.ts
│   │   ├── accounts.ts
│   │   ├── organizations.ts
│   │   ├── loans.ts
│   │   └── legal.ts                  # Terms, disclosures, regulatory blurbs
│   └── index.ts                      # Re-export
│
├── specs/
│   └── openapi.json
│
├── scripts/
│   ├── ensure-charonapi-export.js
│   └── local-dev-server.js
│
├── docs/
│   ├── LOCAL_DEV_SETUP.md
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   └── RBAC.md
│
├── .env.local                        # Environment variables/secrets (local development)
├── tsconfig.json, next.config.js, package.json, etc.
└── README.md                         # ReadMe file
```

| Caller            | Calls                              | After Which                                                               |
| ----------------- | ---------------------------------- | ------------------------------------------------------------------------- |
| Client Components | domainClient                       | Next.js internal proxy API routes                                         |
| domainClients     | internal proxy api routes          | call charonClient                                                         |
| Proxy API routes  | charonClient                       | Call actual external backend api routes                                   |
| Server Actions    | charonClient                       | calls actual externnal backend api routes to Mutate and persist form data |
| charonClient      | Actual external backend API routes | AWS staging endpoint returns data to frontend app!                        |

Proxy routes wrap domain clients; domain clients wrap external APIs; frontend calls proxy routes.

### **Frontend (Client-Side) Flow**

#### **Frontend Components**

- Built with **React** and **Next.js** (App Router).
- UI interacts with the backend through **React Hooks** (e.g., `useLoanData`, `useUserData`) which call **Next.js API routes**.

#### **API Routes**

- API routes in the `/api/` directory act as **proxies** between the frontend and backend services.
- Proxies handle **authentication**, **authorization**, and **input/output sanitization** to ensure no sensitive data is exposed to the frontend.

#### **Domain Clients**

- Proxies call **domain-specific clients** (e.g., `loan-client.ts`, `user-client.ts`), which encapsulate business logic for each domain (e.g., accounts, loans).
- Domain clients interact with the backend database or external services.

#### **External API Integration**

- Domain clients can call **external APIs** (e.g., Charon) via dedicated API clients.
- All communication with external services happens server-side, keeping sensitive credentials secure.

---

### **Security Flow**

#### **Proxies as Gatekeepers**

- Proxies authenticate requests and ensure **role-based access** (admin/user) before allowing access to protected routes.
- They perform **token validation**, **CSRF protection**, and secure access to sensitive endpoints like `/api/proxy/loan-applications/` and `/api/proxy/accounts/`.

#### **Client-Side Data Fetching**

- The frontend never directly calls external APIs. Instead, it interacts with internal **API routes** through React Hooks.
- Proxies act as an **abstraction layer**, keeping business logic and sensitive data secure. The data transformation and business logic mapping external charon response structures to UI expectations happens primarily in the proxy API routes.

---

### **Overall Flow**

1. **Frontend** makes API requests to **domainClients.method()** which then call the **Next.js API routes** (proxies).
2. **Proxies** then call the **charonClient.domain.method()** which is extended off `apiClient` and has the accessToken for authnetication.
3. **charonClient** interacts with the **backend** or **external APIs** (e.g., Charon) to fetch/modify data.
4. **Proxies** return sanitized, non-sensitive data to the frontend.

for most mutations (like creating a loan application, updating an account, deleting a file), the flow is: Client Component → Server Action → Domain Client → Charon Client → Charon API

The Auth exception: The login part of authentication is the primary exception. Your authClient.login() calls signIn(), which internally triggers Auth.js's server-side authorize callback, and that callback calls your Charon API. So it's still "client-initiated, server-executed," but Auth.js is the intermediary server layer that decides how to call Charon for authentication.

# Business Logic & Data Transformation Placement Guide

## 1. Proxy API Routes (PRIMARY BUSINESS LOGIC LAYER)

**What Goes Here:**

- ✅ Core business logic and validation
- ✅ Data transformation between Charon API and your frontend
- ✅ Role-based data filtering and permissions
- ✅ Complex query building
- ✅ Complex calculations (risk scores, eligibility checks)
- ✅ Business rules enforcement
- ✅ Error handling and standardization
- ✅ Caching logic
- ✅ Audit logging

### Example:

```ts
// app/api/proxy/loan-applications/route.ts
export async function GET(request: Request) {
  const userRole = request.headers.get('x-user-role') as UserRole;
  const userId = request.headers.get('x-user-id');
  const { searchParams } = new URL(request.url);

  try {
    // 1. BUSINESS LOGIC: Role-based access control
    const allowedStatuses = getRoleBasedStatuses(userRole);

    // 2. DATA TRANSFORMATION: Build query parameters
    const charonQuery = {
      ...Object.fromEntries(searchParams),
      statuses: allowedStatuses,
      ...(userRole === 'balance_sheet_admin' && {
        organizationId: await getUserOrganization(userId),
      }),
    };

    // 3. BUSINESS LOGIC: Fetch from Charon
    const charonResponse = await charonClient.loanApplications.getAll(charonQuery);

    // 4. DATA TRANSFORMATION: Transform for frontend consumption
    const transformedData = charonResponse.data.map((app) => ({
      ...app,
      displayStatus: getDisplayStatus(app.status),
      canEdit: canUserEditApplication(userRole, app, userId),
      riskScore: calculateRiskScore(app),
      formattedAmounts: formatCurrencyAmounts(app),
    }));

    // 5. BUSINESS LOGIC: Apply additional filtering
    const filteredData = applyBusinessRules(transformedData, userRole);

    return NextResponse.json({
      success: true,
      data: filteredData,
      meta: {
        total: charonResponse.count,
        userPermissions: getUserPermissions(userRole),
      },
    });
  } catch (error) {
    // 6. ERROR HANDLING: Standardize errors
    return handleProxyError(error);
  }
}

// BUSINESS LOGIC FUNCTIONS (in imported utils)
function getRoleBasedStatuses(role: UserRole): string[] {
  switch (role) {
    case 'master_admin':
      return ['draft', 'pending', 'approved', 'declined'];
    case 'balance_sheet_admin':
      return ['pending', 'approved'];
    case 'fund':
      return ['approved'];
    case 'user':
      return ['draft', 'pending'];
  }
}

function calculateRiskScore(application: LoanApplication): number {
  // Complex business calculation
  const incomeRatio = application.loanAmount / application.incomeTotalAmount;
  const assetRatio = application.loanAmount / application.assetTotalValue;
  // ... more complex logic
  return Math.min(100, incomeRatio * 40 + assetRatio * 30 + 30);
}
```

## 2. Server Actions (FORM-SPECIFIC BUSINESS LOGIC)

**What Goes Here:**

- ✅ Form validation and sanitization
- ✅ Multi-step form orchestration
- ✅ File upload processing
- ✅ Form-specific business rules
- ✅ Revalidation and cache invalidation

### Example:

```typescript
// actions/loan-applications/user/submit-application.ts
export async function submitApplicationAction(applicationId: string, formData: FormData) {
  try {
    // 1. FORM VALIDATION: Validate submission data
    const validatedData = await validateSubmissionForm(formData);

    // 2. BUSINESS LOGIC: Check if user can submit
    const application = await fetch(`/api/proxy/loan-applications/${applicationId}`).then((r) => r.json());

    if (!canUserSubmitApplication(application)) {
      return { error: 'Application cannot be submitted in current state' };
    }

    // 3. ORCHESTRATION: Multi-step submission process
    const submissionSteps = [
      () => validateRequiredDocuments(applicationId),
      () => performFinalCalculations(validatedData),
      () => updateApplicationStatus(applicationId, 'pending'),
      () => notifyReviewers(applicationId),
      () => logSubmissionEvent(applicationId),
    ];

    for (const step of submissionSteps) {
      await step();
    }

    // 4. CACHE INVALIDATION
    revalidatePath('/dashboard/loan-applications');
    revalidateTag(`loan-application-${applicationId}`);

    return { success: true, message: 'Application submitted successfully' };
  } catch (error) {
    return { error: 'Failed to submit application' };
  }
}
```

## 4. Hooks (UI STATE & DATA FETCHING)

**What Goes Here:**

- ✅ Data fetching and caching
- ✅ UI state management
- ✅ Loading and error states
- ✅ Optimistic updates
- ❌ NO business logic
- ❌ NO data transformation

### Example:

```typescript
// domains/loan-applications/hooks/useApplicationData.ts
export function useApplicationsData(filters?: LoanApplicationFilters) {
  return useSWR(['loan-applications', filters], () => loanApplicationsClient.getAll(filters), {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  });
}

export function useApplicationForm(applicationId?: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitApplication = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await submitApplicationAction(applicationId!, formData);
      if (result.error) {
        setErrors({ submit: result.error });
      } else {
        // Handle success
        toast.success('Application submitted successfully');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitApplication, isSubmitting, errors };
}
```

## 5. Components (PRESENTATION & UI LOGIC)

**What Goes Here:**

- ✅ UI rendering and interaction
- ✅ Form state management
- ✅ Event handling
- ✅ Client-side validation (UX only)
- ❌ NO business logic
- ❌ NO API calls (use hooks)

### Example:

```typescript
// domains/loan-applications/components/ApplicationList.tsx
export function ApplicationList({ filters }: { filters?: LoanApplicationFilters }) {
  // DATA: Use hooks for data fetching
  const { data, error, isLoading } = useApplicationsData(filters);

  // UI STATE: Local component state
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'createdAt', direction: 'desc' });

  // EVENT HANDLERS: UI interactions
  const handleSort = (field: string) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  // PRESENTATION: Render UI
  return (
    <div>
      {data?.applications.map((app) => (
        <ApplicationCard
          key={app.id}
          application={app}
          canEdit={app.canEdit} // Business logic already applied in proxy
          onSelect={() => handleSelect(app.id)}
        />
      ))}
    </div>
  );
}
```

## 6. Shared Utils (PURE FUNCTIONS)

**What Goes Here:**

- ✅ Reusable business calculations
- ✅ Data formatting functions
- ✅ Validation helpers
- ✅ Pure transformation functions

### Example:

```typescript
// shared/utils/loan-calculations.ts
export function calculateRiskScore(application: LoanApplication): number {
  // Pure business logic function
  if (!application.incomeTotalAmount || !application.assetTotalValue) return 0;

  const incomeRatio = application.loanAmount / application.incomeTotalAmount;
  const assetRatio = application.loanAmount / application.assetTotalValue;
  const employmentMultiplier = getEmploymentMultiplier(application.employmentStatus);

  return Math.min(100, incomeRatio * 40 + assetRatio * 30 + employmentMultiplier);
}

export function formatLoanAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
}
```

## Summary: The Logic Flow

```
1. Component triggers action
2. if form, server action calls charonClient...
3. else a hook calls Domain Client
4. domainClient calls local Proxy API Route
5. Proxy Route applies business logic & calls CharonClient
6. CharonClient calls real external backend API endpoint
7. Proxy Route transforms CharonClient response
8. Transformed response is sent back to the domainClient
9. domainClient returns typed response to hook
10. Hook manages state & caching
11. Component renders UI from hook
```

**Key Principle**: Keep business logic server-side in proxy routes, keep components thin and focused on presentation.

# Next.js Fintech App Architecture Recommendations

## 1. Data Flow Pattern (RECOMMENDED)

**Use this flow**: Client Components → Proxy API Routes → Charon API

### Why This Pattern?

- **Security**: Never expose Charon API keys/tokens to the client
- **Flexibility**: Can add caching, rate limiting, request transformation
- **Error Handling**: Centralized error handling and logging
- **Token Management**: Server-side token refresh/management

### Flow Structure:

```
Client Component → Domain Client → Proxy API Route → Charon Client → Charon API
```

## 2. Server Actions vs Proxy Routes

### Use Server Actions For:

- ✅ Form submissions with validation
- ✅ Simple CRUD operations
- ✅ Operations that don't need complex error handling
- ✅ When you want automatic progressive enhancement

### Use Proxy Routes For:

- ✅ Complex data fetching with query parameters
- ✅ File uploads/downloads
- ✅ Operations needing detailed error responses
- ✅ When you need custom headers/status codes
- ✅ Real-time operations

### Split:

- **Proxy Routes**: All GET operations, file operations, complex queries
- **Server Actions**: POST/PATCH/DELETE for forms, simple mutations

## 4. Permission Management Strategy

### Role-Based Access Control (RBAC) Implementation:

3. **Configure Groups**:
   ```json
   {
     "user": "Standard user access",
     "admin": "Administrative access",
     "super_admin": "Full system access"
   }
   ```

### Role-Based Access Control

- **User**: Access to personal dashboard and loan applications
- **Admin**: User management, application review, basic analytics
- **Super Admin**: Full system access, configuration, advanced analytics

## 🏗️ Domain Architecture

### Auth Domain

- User authentication and session management
- Role-based access control
- Security utilities and guards

### User Domain

- User profile management

### Users Domain

- Admin user management interface

### Loan Applications Domain

- Multi-step application wizard
- Document upload and processing
- Application review and approval
- Status tracking and notifications

### Documents Domain

- File upload and storage
- AI-powered document parsing
- Document validation and verification
- Secure document access

### Signing Domain

- SignWell integration
- Document signing workflows
- Signature status tracking
- Legal compliance

## 🔄 Loan Application Workflow

1. **Application Creation**

   - User starts new application
   - Basic information collection
   - Document requirements check

2. **Document Upload**

   - Multi-file upload support
   - Real-time processing status
   - AI-powered parsing with OpenAI

3. **Data Review**

   - Parsed data validation
   - User confirmation and corrections
   - Additional information requests

4. **Submission**

   - Final application review
   - Terms and conditions acceptance
   - Application status: "Under Review"

5. **Document Signing**

   - SignWell integration
   - Electronic signature collection
   - Legal document generation

6. **Happy Path Auto Approval OR Admin Review**

   - Admin dashboard notification
   - Document verification
   - Risk assessment
   - Approval/rejection decision

7. **Completion**
   - Final approval
   - Notification to user
   - Archive and compliance
