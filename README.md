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

### Technical Features
- **Next.js 14** with App Router and Server Actions
- **TypeScript** for type safety
- **Tailwind CSS** with custom design system
- **Auth.js v5** for authentication and authorization
- **Role-based Access Control** (User, Admin, Super Admin)
- **Comprehensive Logging** with Winston
- **Error Handling** and monitoring
- **Rate Limiting** and security headers

### External Backend Charon API Features
- **Database Integration** with AWS RDS
- **File Upload** to AWS S3

## 📁 Project Structure

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
|     │   ├── (user)/                                          # User dashboard
|     │   │   ├── dashboard/
|     │   │   │   ├── documents/page.tsx                       # statements, uploaded docs, contracts, etc
|     │   │   │   ├── loan-applications/
|     │   │   │   │   ├── [id]/                                # wizard steps after creating new loan application
|     │   │   │   │   │   ├── apply/page.tsx
|     │   │   │   │   │   ├── personal-info/page.tsx
|     │   │   │   │   │   ├── contract/page.tsx
|     │   │   │   │   │   ├── submit/page.tsx
|     │   │   │   │   │   ├── terms/page.tsx
|     │   │   │   │   │   ├── success/page.tsx
|     │   │   │   │   ├── layout.tsx                        # List loan applications
|     │   │   │   │   └── page.tsx                          # View existing loan app
|     │   │   │   ├── profile/page.tsx
|     │   │   │   ├── layout.tsx
|     │   │   │   └── page.tsx
|     │   ├── (admin)/                                      # Admin dashboard
|     │   │   ├── dashboard/
|     │   │   │   ├── accounts/
|     │   │   │   │   ├── page.tsx
|     │   │   │   │   └── [id]/page.tsx
|     │   │   │   ├── organizations/
|     │   │   │   │   ├── page.tsx
|     │   │   │   │   └── [id]/page.tsx
|     │   │   │   ├── loans/
|     │   │   │   │   ├── page.tsx
|     │   │   │   │   └── [id]/page.tsx
|     │   │   │   ├── users/
|     │   │   │   │   ├── page.tsx
|     │   │   │   │   └── [id]/page.tsx
|     │   │   │   ├── settings/page.tsx
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
|     │   │   │   │   ├── PersonalInfoForm.tsx       # review Personal details from parsing
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
|     │   ├── documents/                               # Generic document management (viewing, uploading, parsing)
|     │   │   ├── components/
|     │   │   │   ├── DocumentViewer.tsx
|     │   │   │   ├── DocumentUploader.tsx
|     │   │   │   └── DocumentList.tsx
|     │   │   └── hooks/
|     │   │   │   ├── useDocumentUpload.ts
|     │   │   │   └── useDocumentParsing.ts
|     │   │   ├── hooks/
|     │   │   ├── client.ts
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
|     │   ├── user/
|     │   │   ├── profile/                   # Invokes /auth domain client to post to Charon
|     │   │   │   ├── manage-user.ts         # User profile updates form
|     │   │   │   └── create-user.ts         # Create account form
|     │   ├── users/
|     │   │   └── admin/
|     │   │       └── manage-users.ts         # Admin user management form
|     │   │   │   └── create-user.ts          # Create user form by admin
|     │   ├── accounts/
|     │   │   └── admin/
|     │   │       └── manage-accounts.ts         # Admin accounts management form
|     │   │   │   └── create-account.ts          # Create account form by admin
|     │   ├── organizations/
|     │   │   ├── admin/
|     │   │   │   └── manage-organizations.ts    # Organization management form
|     │   ├── loans/
|     │   │   ├── user/
|     │   │       └── manage-loans.ts            # User update loans form
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
|     │   │       ├── request-info.ts              # Request additional info
|     │   │       ├── bulk-update.ts               # Batch operations
|     │   │       └── reassign-application.ts      # Reassign to different 
|     │
|     ├── shared/                     # Shared building blocks
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
|     │   │   ├── ErrorBoundary.tsx          # Error behavior for catching client-side React errors
|     │   │   ├── LoadingSpinner.tsx         # Suspense loading spinner
|     │   │   └── FileDropzone.tsx           # Documents dropzone for upload
|     │   ├── layout/                        # Shared layout components
|     │   │   ├── Header.tsx                 # App header
|     │   │   ├── UserSidebar.tsx            # User dashboard navigation
|     │   │   ├── AdminSidebar.tsx           # Admin dashboard navigation
|     │   │   └── Footer.tsx                 # Page footer
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

| Caller            | Calls                          | Recommended pattern                   |
| ----------------- | ------------------------------ | ------------------------------------- |
| Server Actions    | External APIs/databases        | POST form data to external backend API directly    |
| Client Components | Next.js API routes        | Use fetch to call internal API routes |
| API routes        | Backend services/external APIs | Proxy or orchestrate external calls   |

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
- Proxies act as an **abstraction layer**, keeping business logic and sensitive data secure.

---

### **Overall Flow**

1. **Frontend** makes API requests to **Next.js API routes** (proxies).
2. **Proxies** authenticate the user, validate tokens, and call **domain clients** for business logic.
3. **Domain clients** interact with the **backend** or **external APIs** (e.g., Charon) to fetch/modify data.
4. **Proxies** return sanitized, non-sensitive data to the frontend.


### 1. Clone and Install

```bash
cd playground
npm install
```

### 2. Environment Configuration

Create `.env.local` with the following variables:

```bash
# App Configuration
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/fintech_db

# AWS Cognito Authentication
AUTH_COGNITO_ID=your-cognito-client-id
AUTH_COGNITO_SECRET=your-cognito-client-secret
AUTH_COGNITO_ISSUER=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx

# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET_NAME=your-s3-bucket-name

# External APIs
CHARON_API_URL=http://localhost:8000/api
CHARON_API_KEY=your-charon-api-key
OPENAI_API_KEY=your-openai-api-key

# SignWell Integration
SIGNWELL_API_KEY=your-signwell-api-key
SIGNWELL_WEBHOOK_SECRET=your-signwell-webhook-secret

# Email Service
EMAIL_FROM=noreply@yourfintech.com
SENDGRID_API_KEY=your-sendgrid-api-key

# Security
ENCRYPTION_KEY=your-32-character-encryption-key
JWT_SECRET=your-jwt-secret
```

### 3. Database Setup

```bash
# Generate database schema
npm run db:generate

# Run migrations
npm run db:migrate

# Optional: Open database studio
npm run db:studio
```

### 4. Development

```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test
```

## 🔐 Authentication & Authorization

### AWS Cognito Setup

1. **Create User Pool**:
   - Enable email sign-in
   - Configure password policies
   - Set up user groups: `user`, `admin`, `super_admin`

2. **Create App Client**:
   - Enable OAuth flows
   - Configure callback URLs
   - Generate client ID and secret

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

6. **Document Signing**
   - SignWell integration
   - Electronic signature collection
   - Legal document generation

5. **Happy Path Auto Approval OR Admin Review**
   - Admin dashboard notification
   - Document verification
   - Risk assessment
   - Approval/rejection decision

7. **Completion**
   - Final approval
   - Notification to user
   - Archive and compliance

## 🎨 UI/UX Features

### Design System
- **Consistent Color Palette** with light/dark mode support
- **Typography Scale** with Inter font family
- **Component Library** with Radix UI primitives
- **Animation System** with smooth transitions
- **Responsive Grid** with mobile-first approach

### User Experience
- **Progressive Disclosure** for complex workflows
- **Real-time Feedback** with loading states
- **Error Handling** with clear messaging
- **Accessibility** WCAG 2.1 AA compliance
- **Performance** optimized for Core Web Vitals

## 📊 Monitoring & Analytics

### Logging
- **Structured Logging** with Winston
- **Domain-specific Loggers** for better organization
- **Security Audit Trails** for compliance
- **Performance Monitoring** for optimization

### Analytics
- **User Behavior Tracking** (privacy-compliant)
- **Application Metrics** and conversion rates
- **System Performance** monitoring
- **Business Intelligence** dashboards

## 🔒 Security Features

### Data Protection
- **End-to-end Encryption** for sensitive data
- **Secure File Storage** with AWS S3
- **Input Validation** with Zod schemas

### Authentication Security
- **Multi-factor Authentication** support
- **Session Management** with secure cookies
- **Rate Limiting** to prevent abuse
- **CSRF Protection** built-in

### Compliance
- **GDPR Compliance** with data portability
- **SOC 2 Type II** security controls
- **PCI DSS** for payment data (if applicable)
- **Audit Logging** for regulatory requirements

### Code Standards
- **TypeScript** strict mode enabled
- **ESLint** with Next.js configuration
- **Prettier** for code formatting
- **Conventional Commits** for git messages

## 📝 API Documentation

### RESTful Endpoints
- `GET /api/users` - User management
- `POST /api/loan-applications` - Create application
- `PUT /api/loan-applications/:id` - Update application
- `POST /api/documents/upload` - Upload documents
- `POST /api/signing/initiate` - Start signing process

### Server Actions
- `createLoanApplication()` - Server-side application creation
- `uploadDocument()` - Secure file upload
- `approveApplication()` - Admin approval workflow
- `generateReport()` - Analytics and reporting