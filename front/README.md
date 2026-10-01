# KeyNest MVP UI Flow Tree

The MVP should focus on one core workflow:

> **Register → create encrypted handoff → share link → recipient verifies identity → downloads/decrypts → sender monitors or revokes access**

## 1. Application flow tree

```text
KeyNest
├── Public Area
│   ├── Landing Page
│   │   ├── Product explanation
│   │   ├── How client-side encryption works
│   │   ├── Create account
│   │   └── Sign in
│   │
│   ├── Sign Up
│   │   ├── Email
│   │   ├── Password
│   │   ├── Confirm password
│   │   ├── Password-strength indicator
│   │   ├── Terms acceptance
│   │   └── Account created
│   │
│   ├── Sign In
│   │   ├── Email
│   │   ├── Password
│   │   ├── Invalid credentials
│   │   └── Forgot password
│   │
│   └── Recipient Handoff Page
│       ├── Invalid link
│       ├── Expired link
│       ├── Revoked link
│       ├── Verification required
│       ├── Successful verification
│       └── Download page
│
└── Authenticated Area
    ├── Dashboard
    │   ├── Recent handoffs
    │   ├── Create handoff button
    │   ├── Active links count
    │   ├── Expiring soon count
    │   └── Recent activity
    │
    ├── Create Handoff
    │   ├── Select file
    │   ├── Add confidential message
    │   ├── Configure expiration
    │   ├── Configure download limit
    │   ├── Require recipient verification
    │   ├── Review settings
    │   ├── Encrypt locally
    │   ├── Upload encrypted data
    │   └── Handoff created
    │
    ├── Handoff Details
    │   ├── File information
    │   ├── Encryption status
    │   ├── Expiration status
    │   ├── Recipient access status
    │   ├── Copy secure link
    │   ├── Regenerate link
    │   ├── Revoke access
    │   └── View activity
    │
    ├── Activity
    │   ├── Link created
    │   ├── Link opened
    │   ├── Verification attempted
    │   ├── Download completed
    │   ├── Link revoked
    │   └── Link expired
    │
    └── Settings
        ├── Account details
        ├── Change password
        ├── Session management
        └── Sign out
```

# 2. Recommended route structure

```text
/
├── /
├── /signup
├── /login
├── /forgot-password
├── /share/:shareToken
├── /share/:shareToken/verify
├── /share/:shareToken/download
│
└── /app
    ├── /app/dashboard
    ├── /app/handoffs/new
    ├── /app/handoffs/:handoffId
    ├── /app/activity
    └── /app/settings
```

In React Router, your authenticated routes should be protected by an `AuthGuard`.

```text
<AppRouter>
├── <PublicRoutes />
├── <RecipientRoutes />
└── <ProtectedRoute>
    └── <AuthenticatedLayout>
        ├── <Dashboard />
        ├── <CreateHandoff />
        ├── <HandoffDetails />
        ├── <Activity />
        └── <Settings />
```

# 3. Main sender flow

## Create encrypted handoff

```text
Dashboard
    ↓
Click "Create handoff"
    ↓
Select file
    ↓
Validate file
    ├── No file selected
    ├── File too large
    ├── Unsupported file type
    └── Valid file
    ↓
Add optional message
    ↓
Configure security
    ├── Expiration
    │   ├── 1 hour
    │   ├── 24 hours
    │   ├── 7 days
    │   └── Custom
    │
    ├── Maximum downloads
    │   ├── 1
    │   ├── 3
    │   ├── 5
    │   └── Unlimited
    │
    └── Recipient verification
        ├── None
        └── One-time verification code
    ↓
Review handoff
    ↓
Encrypt locally
    ├── Generating file key
    ├── Encrypting file
    ├── Preparing encrypted metadata
    └── Encryption failed
    ↓
Upload encrypted file
    ├── Uploading
    ├── Upload failed
    └── Upload successful
    ↓
Handoff created
    ↓
Display secure link
    ├── Copy link
    ├── Share link
    ├── View details
    └── Return to dashboard
```

## Recommended UI steps

Use a stepper component:

```text
[1 File] → [2 Security] → [3 Review] → [4 Encrypt] → [5 Share]
```

The user should never see a confusing cryptographic process. Use understandable messages such as:

- “Your file is being encrypted on this device.”
- “The server will receive only encrypted data.”
- “Keep this link private.”
- “This link expires in 24 hours.”

# 4. Recipient flow

```text
Recipient opens secure link
    ↓
Check link status
    ├── Invalid
    ├── Expired
    ├── Revoked
    ├── Download limit reached
    └── Active
    ↓
Display handoff information
    ├── File name
    ├── File size
    ├── Expiration time
    └── Sender message
    ↓
Verification required?
    ├── No
    │   └── Continue to download
    │
    └── Yes
        ├── Enter verification code
        ├── Code invalid
        ├── Code expired
        ├── Too many attempts
        └── Verification successful
    ↓
Download encrypted file
    ↓
Decrypt locally
    ├── Decryption in progress
    ├── Integrity check failed
    └── Decryption successful
    ↓
Save file to device
    ↓
Display completion message
```

The recipient should not need to create an account for the MVP. Requiring an account would add friction and complicate the primary use case.

# 5. Dashboard UI

```text
AuthenticatedLayout
├── Sidebar
│   ├── Logo
│   ├── Dashboard
│   ├── Create handoff
│   ├── Activity
│   ├── Settings
│   └── Sign out
│
├── Topbar
│   ├── Page title
│   ├── User menu
│   └── Mobile menu button
│
└── Dashboard content
    ├── Welcome message
    ├── Create handoff button
    ├── Statistics cards
    │   ├── Total handoffs
    │   ├── Active links
    │   ├── Expiring soon
    │   └── Downloads
    ├── Recent handoffs table
    └── Recent activity list
```

Example handoff table:

| File | Status | Expires | Downloads | Actions |
|---|---|---|---:|---|
| `backup.zip` | Active | In 22 hours | 0/1 | View |
| `config.pdf` | Downloaded | Expired | 1/1 | View |
| `notes.txt` | Revoked | Revoked | 0/3 | View |

# 6. Create Handoff components

```text
CreateHandoffPage
├── HandoffStepper
├── FileDropzone
│   ├── Drag-and-drop area
│   ├── File browser button
│   ├── File preview
│   ├── File size
│   └── Remove file button
│
├── MessageInput
├── ExpirationSelector
├── DownloadLimitSelector
├── VerificationToggle
├── SecurityNotice
├── HandoffReview
├── EncryptionProgress
├── UploadProgress
└── HandoffSuccess
```

Suggested reusable components:

```text
components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Modal.tsx
│   ├── Badge.tsx
│   ├── Alert.tsx
│   ├── ProgressBar.tsx
│   └── Spinner.tsx
│
├── layout/
│   ├── AppLayout.tsx
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   └── PageContainer.tsx
│
├── handoffs/
│   ├── FileDropzone.tsx
│   ├── HandoffCard.tsx
│   ├── HandoffTable.tsx
│   ├── HandoffStatusBadge.tsx
│   ├── SecuritySettings.tsx
│   ├── HandoffReview.tsx
│   └── ActivityTimeline.tsx
│
└── recipient/
    ├── ShareHeader.tsx
    ├── VerificationForm.tsx
    ├── FileDownloadCard.tsx
    └── LinkStatusMessage.tsx
```

# 7. Page-state tree

Each important page should explicitly handle these states:

```text
Page
├── Loading
├── Empty
├── Success
├── Error
├── Unauthorized
└── Expired or unavailable
```

For example:

```text
HandoffDetailsPage
├── LoadingHandoff
├── HandoffNotFound
├── HandoffActive
├── HandoffExpired
├── HandoffRevoked
├── RevokeConfirmationModal
└── RevokeSuccessToast
```

Avoid displaying only a generic error. Use specific messages:

```text
"Unable to load this handoff."
"The link may have expired or been revoked."
```

# 8. Suggested TypeScript types

```typescript
export type HandoffStatus =
  | "active"
  | "expired"
  | "revoked"
  | "downloaded"
  | "download_limit_reached";

export type VerificationMethod = "none" | "email_code";

export interface Handoff {
  id: string;
  fileName: string;
  fileSize: number;
  status: HandoffStatus;
  expiresAt: string;
  maxDownloads: number | null;
  downloadCount: number;
  verificationMethod: VerificationMethod;
  createdAt: string;
}

export interface CreateHandoffInput {
  file: File;
  message?: string;
  expiresAt: string;
  maxDownloads: number | null;
  verificationMethod: VerificationMethod;
}

export interface ActivityEvent {
  id: string;
  handoffId: string;
  type:
    | "created"
    | "opened"
    | "verification_success"
    | "verification_failed"
    | "downloaded"
    | "revoked"
    | "expired";
  createdAt: string;
}
```

# 9. Frontend folder structure

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
│
├── assets/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── handoffs/
│   └── recipient/
│
├── features/
│   ├── auth/
│   │   ├── api.ts
│   │   ├── authStore.ts
│   │   └── components/
│   │
│   ├── handoffs/
│   │   ├── api.ts
│   │   ├── encryption.ts
│   │   ├── types.ts
│```text
src/
├── features/
│   ├── auth/
│   │   ├── api.ts
│   │   ├── authStore.ts
│   │   └── components/
│   │
│   ├── handoffs/
│   │   ├── api.ts
│   │   ├── encryption.ts
│   │   ├── types.ts
│   │   └── components/
│   │
│   └── activity/
│       ├── api.ts
│       └── types.ts
│
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx
│   ├── CreateHandoffPage.tsx
│   ├── HandoffDetailsPage.tsx
│   ├── ActivityPage.tsx
│   ├── SettingsPage.tsx
│   └── RecipientHandoffPage.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useHandoffs.ts
│   └── useEncryption.ts
│
├── lib/
│   ├── apiClient.ts
│   ├── formatters.ts
│   └── validation.ts
│
├── types/
│   └── index.ts
│
├── router/
│   └── ProtectedRoute.tsx
│
├── main.tsx
└── index.css
```

# 10. Encryption-related frontend service

For the MVP, use the browser’s Web Crypto API rather than implementing AES manually.

```typescript
// src/features/handoffs/encryption.ts

export async function generateFileKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptFile(
  file: File,
  key: CryptoKey
): Promise<{ encryptedData: ArrayBuffer; iv: Uint8Array }> {
  const fileData = await file.arrayBuffer();

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    fileData
  );

  return {
    encryptedData,
    iv,
  };
}

export async function decryptFile(
  encryptedData: ArrayBuffer,
  key: CryptoKey,
  iv: Uint8Array
): Promise<Blob> {
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encryptedData
  );

  return new Blob([decryptedData]);
}
```

The encryption process in the UI should be:

```text
User selects file
    ↓
Generate random AES-GCM file key
    ↓
Generate random initialization vector
    ↓
Encrypt file in browser
    ↓
Upload only encrypted file
    ↓
Protect or wrap file key
    ↓
Store handoff metadata
```

Do not place secret keys in:

- URLs
- React component state that is unnecessarily persisted
- Local storage without a clear security design
- Console logs
- Analytics events
- API request logs

For the first prototype, you can keep the temporary decryption key in memory while the page is open. Later, implement public-key encryption or a secure key-wrapping service.

# 11. MVP implementation order

Build the project in this order:

1. Create the Vite React TypeScript project.
2. Add Tailwind CSS.
3. Create the application layout and navigation.
4. Build signup and login pages.
5. Build the dashboard with mock handoff data.
6. Build the file dropzone.
7. Add expiration and download-limit controls.
8. Implement local AES-GCM encryption.
9. Add encrypted-file upload.
10. Build the recipient handoff page.
11. Add recipient verification.
12. Add local decryption and file download.
13. Add revoke and expiration states.
14. Add the activity timeline.
15. Replace mock data with backend API calls.
16. Add unit and integration tests.

# 12. Tailwind design direction

Use a clean security-oriented interface:

```text
Primary color:   Indigo or blue
Success color:   Emerald
Warning color:   Amber
Danger color:    Red
Background:      Slate-50
Cards:           White
Text:            Slate-900
Secondary text:  Slate-500
```

Example dashboard card:

```tsx
<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500">
        Active handoffs
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        12
      </p>
    </div>

    <div className="rounded-lg bg-indigo-100 p-3 text-indigo-600">
      {/* Icon */}
    </div>
  </div>
</div>
```

Example security notice:

```tsx
<div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
  Your file will be encrypted in this browser before it is uploaded.
  The server will receive only encrypted data.
</div>
```

# 13. MVP success criteria

Your MVP is complete when a user can:

- Create an account
- Log in
- Select a file
- Encrypt it in the browser
- Set an expiration time
- Generate a secure handoff link
- Open the link as a recipient
- Verify access
- Download and decrypt the file
- See the handoff in the dashboard
- Revoke the link
- Receive an appropriate error for expired or revoked links

Keep the first version narrow. Do not add team accounts, mobile apps, browser extensions, multiple recipients, or advanced key splitting until the basic encryption and handoff workflow works reliably.