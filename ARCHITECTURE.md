
### 1\. Managing Permissions (Roles)

#### Centralized Authentication & Session Management (`auth.ts`, `middleware.ts`)

1.  **Auth.js (`auth.ts`, `auth.config.ts`):** The primary gatekeeper.
      * **Session Callbacks:** Use Auth.js's `callbacks.session` and `callbacks.jwt` to inject user roles (`type` from your `User` schema) into the session token. When a user logs in, their `User.type` (individual, manager, admin) should be part of their session.
      * **Custom Session Strategy:** Need to configure a custom session strategy to ensure roles are consistently available.
2.  **Middleware (`middleware.ts`):** This is your first line of defense for route protection.
      * **Pattern Matching:** Use `matcher` to define which paths require authentication.
      * **Authorization Logic:** Inside `middleware.ts`, access the session (which now contains the user's role) and implement logic to redirect or deny access based on the requested path and the user's role.
          * **Example:**
              * `/(admin)/dashboard/...`: Only allow `admin` or `master-admin` roles.
              * `/(user)/dashboard/loan-applications/...`: Allow `individual`, `manager`, `admin`, `master-admin`.
              * `/(user)/dashboard/profile`: Allow all authenticated roles, but then further restrict data access based on ownership within server actions/API routes.

#### Granular Authorization (Server Actions & API Routes)

This is where the fine-grained control for "their own loans," "their own users," etc., happens.

1.  **Server Actions (`src/actions/`):**

      * **Retrieve Session:** Inside each Server Action, retrieve the current user's session using `auth()` (from `auth.ts`).
      * **Extract Role & User ID:** Get the user's `id` and `type` (role) from the session.
      * **Authorization Checks:**
          * **Master Admin:** If `user.type === 'admin'` (or your custom `master-admin` type), allow all operations.
          * **Broker Admin (Manager):**
              * For operations on **loans/loan applications/files/assets/incomes**: Check if the `accountId` associated with the resource belongs to the organizations managed by this `broker-admin`. This requires the `broker-admin` to be linked to specific organizations, and those organizations to have `accounts` associated with them. Your `Organization` schema `type` enum has `admin` and `client`. You'll need a way to link `manager` users to specific `client` organizations and then `accounts` to those `client` organizations.
              * For operations on **users**: Check if the target `userId` is within their managed scope (e.g., users within the same organization).
          * **Fund Role:** Similar to Broker Admin, but even more restricted, likely read-only or only able to update specific fields on their *own* associated `Account` or `Organization` data. The `Organization` schema has `type: client` and `domain`. You might link Fund roles to specific `Organization` IDs and restrict them to data associated with those organizations.
          * **User Role (Individual):** Only allow operations on resources where `resource.accountId === user.id` (assuming `user.id` from session directly maps to an `accountId` if they have one, or you link them). For profile, `userId === session.user.id`.
      * **Error Handling:** If authorization fails, throw an error (e.g., a custom `UnauthorizedError`) which can then be caught and handled by your UI (e.g., display a toast, redirect).


2.  **API Routes (`app/api/proxy/`):**

      * **Similar Logic:** Implement the same session retrieval and authorization checks within your API route handlers (`route.ts`).
      * **Example for `accounts/[accountId]/route.ts` (PATCH/DELETE):**
          * When a `PATCH /accounts/{id}` request comes in, the `route.ts` handler gets the `accountId` from the URL.
          * It then checks the session:
              * Is the user an `admin`? If yes, allow.
              * Is the `accountId` from the URL the same as the `session.user.id` (for individual users updating their *own* account, if they can)?
              * Is the user a `manager` AND does the `accountId` belong to an organization this manager has permission over?

#### Mapping Backend `accountId` to User Sessions:

This is crucial for individuals.

  * When a user registers or logs in, if their `User` profile can be definitively linked to an `Account` (e.g., `User.id === Account.id` or `User.secId === Account.secId`), then you can store this `accountId` directly in the Auth.js session `jwt` and `session` callbacks.
  * If an `Account` is only created *after* a loan application, then when a user *creates* their first loan application, you'd associate that new `Account` with their `User.id` in your backend. When fetching data for the user, you'd query the backend for `accounts` associated with `session.user.id`.

#### `User` vs. `Account` distinction:
  * A `User` (`src/domains/users`) is the primary authentication identity.
  * An `Account` (`src/domains/accounts`) is a financial entity linked to a `User` after a loan application is created.
  * A `User` can have zero or more `Accounts` (meaning they can have more than one loan application open, asset permitting).

**Implications for RBAC:**

  * **User Role (Individual):** When an individual user logs in, their `session.user.id` is their `User` ID. When they try to access `accounts/{id}`, `loan-applications/{id}`, `loans/{id}`, etc., the authorization logic must check if the `id` in the URL/payload corresponds to an `Account` that *their* `User` ID is linked to.
  * **Broker Admin/Fund Role:** These roles are likely associated with `Organizations`. Their permissions would be scoped to `Accounts` and `Users` that belong to or are managed by *their* `Organization`. This requires additional lookup logic: `session.user.organizationId` (if stored in session) -\> fetch `accounts` linked to that `organizationId`.

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

#### When to Use Server Actions vs. API Routes:

  * **Server Actions:** Ideal for **mutations** (POST, PUT, PATCH, DELETE) initiated from forms or client-side interactions where you want to update data and potentially revalidate cache. They are best when the operation is directly tied to a user action from a page.
  * **API Routes (`app/api/`):** Still crucial for **data fetching** (GET requests from client components, especially for complex queries, filtering, or pagination), **proxying external services** (as you've designed), and **webhooks** or **third-party integrations** that require a public endpoint not directly tied to a UI form submission.

`app/api/proxy/` is a **design choice** for:
  * **Clarity and Organization:** These API routes are specifically designed to proxy requests to your internal/external backend services. This distinction is valuable, especially as the app grows and possibly introduces other types of API routes (i.e., scheduled tasks, webhooks).
  * **Security Context:** The "proxy" subfolder can visually reinforce that these routes handle sensitive backend interactions and likely involve authentication and authorization middleware.

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
  const userRole = request.headers.get('x-user-role') as UserRole
  const userId = request.headers.get('x-user-id')
  const { searchParams } = new URL(request.url)
  
  try {
    // 1. BUSINESS LOGIC: Role-based access control
    const allowedStatuses = getRoleBasedStatuses(userRole)
    
    // 2. DATA TRANSFORMATION: Build query parameters
    const charonQuery = {
      ...Object.fromEntries(searchParams),
      statuses: allowedStatuses,
      ...(userRole === 'balance_sheet_admin' && { 
        organizationId: await getUserOrganization(userId) 
      })
    }
    
    // 3. BUSINESS LOGIC: Fetch from Charon
    const charonResponse = await charonClient.loanApplications.getAll(charonQuery)
    
    // 4. DATA TRANSFORMATION: Transform for frontend consumption
    const transformedData = charonResponse.data.map(app => ({
      ...app,
      displayStatus: getDisplayStatus(app.status),
      canEdit: canUserEditApplication(userRole, app, userId),
      riskScore: calculateRiskScore(app),
      formattedAmounts: formatCurrencyAmounts(app)
    }))
    
    // 5. BUSINESS LOGIC: Apply additional filtering
    const filteredData = applyBusinessRules(transformedData, userRole)
    
    return NextResponse.json({
      success: true,
      data: filteredData,
      meta: { 
        total: charonResponse.count,
        userPermissions: getUserPermissions(userRole)
      }
    })
    
  } catch (error) {
    // 6. ERROR HANDLING: Standardize errors
    return handleProxyError(error)
  }
}

// BUSINESS LOGIC FUNCTIONS (in imported utils)
function getRoleBasedStatuses(role: UserRole): string[] {
  switch (role) {
    case 'master_admin': return ['draft', 'pending', 'approved', 'declined']
    case 'balance_sheet_admin': return ['pending', 'approved'] 
    case 'fund': return ['approved']
    case 'user': return ['draft', 'pending']
  }
}

function calculateRiskScore(application: LoanApplication): number {
  // Complex business calculation
  const incomeRatio = application.loanAmount / application.incomeTotalAmount
  const assetRatio = application.loanAmount / application.assetTotalValue
  // ... more complex logic
  return Math.min(100, (incomeRatio * 40) + (assetRatio * 30) + 30)
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
export async function submitApplicationAction(
  applicationId: string, 
  formData: FormData
) {
  try {
    // 1. FORM VALIDATION: Validate submission data
    const validatedData = await validateSubmissionForm(formData)
    
    // 2. BUSINESS LOGIC: Check if user can submit
    const application = await fetch(`/api/proxy/loan-applications/${applicationId}`)
      .then(r => r.json())
    
    if (!canUserSubmitApplication(application)) {
      return { error: 'Application cannot be submitted in current state' }
    }
    
    // 3. ORCHESTRATION: Multi-step submission process
    const submissionSteps = [
      () => validateRequiredDocuments(applicationId),
      () => performFinalCalculations(validatedData),
      () => updateApplicationStatus(applicationId, 'pending'),
      () => notifyReviewers(applicationId),
      () => logSubmissionEvent(applicationId)
    ]
    
    for (const step of submissionSteps) {
      await step()
    }
    
    // 4. CACHE INVALIDATION
    revalidatePath('/dashboard/loan-applications')
    revalidateTag(`loan-application-${applicationId}`)
    
    return { success: true, message: 'Application submitted successfully' }
    
  } catch (error) {
    return { error: 'Failed to submit application' }
  }
}
```

## 3. Domain Clients (THIN API WRAPPERS)

**What Goes Here:**
- ✅ Type-safe API calls to proxy routes
- ✅ Basic error handling
- ✅ Request/response typing
- ❌ NO business logic
- ❌ NO data transformation

### Example:
```typescript
// domains/loan-applications/client.ts
export const loanApplicationsClient = {
  // Simple, typed wrappers around proxy routes
  async getAll(params?: LoanApplicationQuery): Promise<LoanApplicationResponse> {
    const url = new URL('/api/proxy/loan-applications', window.location.origin)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) url.searchParams.set(key, String(value))
      })
    }
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch loan applications')
    return response.json()
  },

  async getById(id: string): Promise<LoanApplication> {
    const response = await fetch(`/api/proxy/loan-applications/${id}`)
    if (!response.ok) throw new Error('Failed to fetch loan application')
    return response.json()
  },

  async update(id: string, data: Partial<LoanApplication>): Promise<LoanApplication> {
    const response = await fetch(`/api/proxy/loan-applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update loan application')
    return response.json()
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
  return useSWR(
    ['loan-applications', filters],
    () => loanApplicationsClient.getAll(filters),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  )
}

export function useApplicationForm(applicationId?: string) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const submitApplication = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      const result = await submitApplicationAction(applicationId!, formData)
      if (result.error) {
        setErrors({ submit: result.error })
      } else {
        // Handle success
        toast.success('Application submitted successfully')
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return { submitApplication, isSubmitting, errors }
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
  const { data, error, isLoading } = useApplicationsData(filters)
  
  // UI STATE: Local component state
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'createdAt', direction: 'desc' })
  
  // EVENT HANDLERS: UI interactions
  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  // PRESENTATION: Render UI
  return (
    <div>
      {data?.applications.map(app => (
        <ApplicationCard 
          key={app.id} 
          application={app}
          canEdit={app.canEdit} // Business logic already applied in proxy
          onSelect={() => handleSelect(app.id)}
        />
      ))}
    </div>
  )
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
  if (!application.incomeTotalAmount || !application.assetTotalValue) return 0
  
  const incomeRatio = application.loanAmount / application.incomeTotalAmount
  const assetRatio = application.loanAmount / application.assetTotalValue
  const employmentMultiplier = getEmploymentMultiplier(application.employmentStatus)
  
  return Math.min(100, (incomeRatio * 40) + (assetRatio * 30) + employmentMultiplier)
}

export function formatLoanAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD'
  }).format(amount)
}
```

## Summary: The Logic Flow

```
1. Component triggers action
2. Hook calls Domain Client  
3. Domain Client calls Proxy Route
4. Proxy Route applies business logic & calls Charon
5. Proxy Route transforms Charon response
6. Domain Client returns typed response
7. Hook manages state & caching
8. Component renders UI
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

#### Middleware (auth check + role detection):
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  const userRole = token.role as UserRole
  const path = request.nextUrl.pathname
  
  // Role-based route protection
  if (path.startsWith('/admin') && !hasAdminAccess(userRole)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }
  
  // Add role to headers for API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-role', userRole)
  requestHeaders.set('x-user-id', token.sub!)
  
  return NextResponse.next({
    request: { headers: requestHeaders }
  })
}
```

#### Proxy Route Permission Checks:
```typescript
// app/api/proxy/accounts/route.ts
export async function GET(request: Request) {
  const userRole = request.headers.get('x-user-role')
  const userId = request.headers.get('x-user-id')
  
  // Role-based data filtering
  const queryParams = getRoleBasedQueryParams(userRole, userId)
  
  const response = await charonClient.accounts.getAccounts(queryParams)
  return NextResponse.json(response)
}
```

## 5. Simplified Hooks Strategy

### Keep Only These Hook Types:

1. **Data Fetching Hooks** (using SWR/React Query):
```typescript
// domains/accounts/hooks/useAccountsData.ts
export function useAccountsData() {
  return useSWR('/api/proxy/accounts', fetcher)
}
```

2. **Form State Hooks**:
```typescript
// domains/accounts/hooks/useAccountForm.ts
export function useAccountForm(initialData?: Account) {
  // Form validation, submission, state management
}
```

3. **UI State Hooks** (for complex components):
```typescript
// domains/loan-applications/hooks/useApplicationWizard.ts
export function useApplicationWizard() {
  // Multi-step form state, navigation, validation
}
```

## 7. Data Flow Examples

### GET Operation (Data Fetching):
```typescript
// 1. Component
const { data, error } = useAccountsData()

// 2. Hook
function useAccountsData() {
  return useSWR('/api/proxy/accounts', accountsClient.getAccounts)
}

// 3. Domain Client
const accountsClient = {
  getAccounts: () => fetch('/api/proxy/accounts').then(r => r.json())
}

// 4. Proxy Route
export async function GET() {
  return charonClient.accounts.getAccounts()
}
```

### POST Operation (Form Submission):
```typescript
// 1. Component
<form action={createAccountAction}>

// 2. Server Action
export async function createAccountAction(formData: FormData) {
  const result = await fetch('/api/proxy/accounts', {
    method: 'POST',
    body: JSON.stringify(formData)
  })
  revalidatePath('/accounts')
}

// 3. Proxy Route
export async function POST(request: Request) {
  const data = await request.json()
  return charonClient.accounts.createAccount(data)
}
```

## 8. Key Benefits of This Approach

1. **Security**: Charon credentials never leave the server
2. **Performance**: Can add caching at proxy layer
3. **Flexibility**: Easy to modify requests/responses
4. **Maintainability**: Clear separation of concerns
5. **Type Safety**: Full TypeScript support throughout
6. **Role-Based Access**: Centralized permission management