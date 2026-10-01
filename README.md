


# KeyNest

> A client-side encrypted, expiring data-handoff platform for securely sharing sensitive files and messages.

KeyNest allows users to encrypt files in their browser before uploading them. The backend stores and serves encrypted data while managing access control, expiration, verification, download limits, revocation, and activity records.

The project is designed as an educational cybersecurity and software-engineering project that demonstrates practical use of encryption, authentication, authorization, key management, secure file handling, and REST API design.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Problem Statement](#problem-statement)
* [Project Goals](#project-goals)
* [Project Scope](#project-scope)
* [Core Features](#core-features)
* [How It Works](#how-it-works)
* [Security Model](#security-model)
* [Threat Model](#threat-model)
* [Technology Stack](#technology-stack)
* [System Architecture](#system-architecture)
* [Project Structure](#project-structure)
* [User Flows](#user-flows)
* [API Overview](#api-overview)
* [Data Model](#data-model)
* [Frontend Setup](#frontend-setup)
* [Backend Setup](#backend-setup)
* [Environment Variables](#environment-variables)
* [Database Setup](#database-setup)
* [Running the Project](#running-the-project)
* [Testing](#testing)
* [Security Guidelines](#security-guidelines)
* [Limitations](#limitations)
* [Future Roadmap](#future-roadmap)
* [Contributing](#contributing)
* [License](#license)

---

## Project Overview

KeyNest is a secure temporary data-sharing platform.

A sender can:

1. Select a sensitive file.
2. Encrypt it locally in the browser.
3. Configure expiration and download limits.
4. Generate a secure handoff link.
5. Share the link with a recipient.
6. Revoke access at any time.
7. Monitor access activity.

A recipient can:

1. Open the handoff link.
2. Complete verification if required.
3. Download the encrypted file.
4. Decrypt the file locally in the browser.
5. Save the recovered file to their device.

The backend manages the encrypted file and access rules, but the intended design is that it does not receive the plaintext file.

---

## Problem Statement

Sensitive files are frequently shared through email, messaging platforms, or ordinary cloud-storage links. These methods can create risks such as:

* Long-lived access links
* Unclear download permissions
* No automatic expiration
* Insecure password sharing
* Lack of access visibility
* Uncontrolled redistribution
* Plaintext files stored on third-party servers

KeyNest addresses these problems by combining client-side encryption with temporary access controls and auditable handoff events.

---

## Project Goals

### Primary goals

* Encrypt files before they are uploaded.
* Store encrypted files rather than plaintext files.
* Allow senders to define expiration policies.
* Support limited or one-time downloads.
* Provide recipient verification.
* Allow senders to revoke access.
* Record useful access events.
* Provide a clear and simple user interface.
* Demonstrate practical cryptographic engineering using established algorithms.

### Secondary goals

* Provide a modular Django REST Framework backend.
* Create a maintainable React frontend.
* Make the system suitable for future team and enterprise features.
* Demonstrate secure authentication and authorization.
* Provide automated tests for important security-sensitive operations.

---

## Project Scope

### Included in the MVP

* User registration
* User login and logout
* Authenticated dashboard
* Encrypted file upload
* Client-side AES-GCM encryption
* Secure handoff links
* Expiration dates
* Maximum download limits
* Optional recipient verification
* Recipient download flow
* Client-side decryption
* Handoff revocation
* Activity logging
* File-size validation
* Authentication and authorization
* Basic API throttling
* PostgreSQL database support
* Automated backend tests

### Not included in the initial MVP

* Multi-user organizations
* Team administration
* Native mobile applications
* Browser extensions
* End-to-end encrypted chat
* Large-scale video streaming
* Advanced enterprise key-management systems
* Hardware security module integration
* Automatic malware scanning
* Legal or regulatory compliance certification
* Guaranteed protection against compromised user devices

---

## Core Features

### 1. Client-side file encryption

Files are encrypted in the browser before being uploaded.

The intended encryption algorithm is:

```text
AES-256-GCM
```

AES-GCM provides:

* Confidentiality
* Integrity protection
* Authentication of the encrypted data

The frontend uses the browser's Web Crypto API instead of implementing cryptographic algorithms manually.

---

### 2. Expiring handoff links

Each handoff has an expiration time.

Supported policies may include:

* One hour
* Twenty-four hours
* Seven days
* Custom expiration time

Once a handoff expires, the backend rejects further access attempts.

---

### 3. Download limits

The sender can define how many times a handoff can be downloaded.

Examples:

* One download
* Three downloads
* Five downloads
* Unlimited downloads

Download counters must be enforced on the backend, not only in the frontend.

---

### 4. Recipient verification

A sender may require the recipient to complete an additional verification step.

The MVP can use a one-time verification code.

The verification code should:

* Expire quickly
* Have a limited number of attempts
* Be stored as a hash
* Be invalidated after successful use
* Be rate-limited

---

### 5. Revocation

The sender can revoke an active handoff.

After revocation:

* The share link becomes unusable.
* Further download attempts are rejected.
* A revocation event is recorded.
* The encrypted file may be scheduled for deletion.

---

### 6. Activity logging

KeyNest records non-sensitive events such as:

* Handoff created
* Share link opened
* Verification requested
* Verification succeeded
* Verification failed
* File downloaded
* Handoff revoked
* Handoff expired

Activity logs must not contain:

* Passwords
* Encryption keys
* Verification codes
* Plaintext file contents
* Sensitive file contents in metadata

---

### 7. Secure password storage

User passwords are never stored as plaintext.

The backend should use Django's password hashing framework, configured with a strong password hasher such as Argon2 or another appropriate password-specific hashing algorithm.

Passwords must never be:

* Logged
* Returned in API responses
* Stored in frontend local storage
* Included in analytics events

---

## How It Works

### Sender flow

```text
User logs in
    ↓
Selects a file
    ↓
Frontend generates a random file-encryption key
    ↓
Frontend generates a random initialization vector
    ↓
Frontend encrypts the file with AES-GCM
    ↓
Frontend uploads the encrypted file
    ↓
Backend stores encrypted data and handoff metadata
    ↓
Backend returns a secure share token
    ↓
Frontend creates a share link
    ↓
Sender shares the link
```

### Recipient flow

```text
Recipient opens the share link
    ↓
Frontend requests handoff status
    ↓
Backend checks token, expiration, revocation, and download limits
    ↓
Recipient completes verification if required
    ↓
Frontend downloads the encrypted file
    ↓
Frontend obtains the decryption key from the client-side handoff context
    ↓
Frontend decrypts the file locally
    ↓
Recipient saves the recovered file
```

---

## Security Model

### Encryption

The MVP uses:

```text
AES-256-GCM
```

Each file should use:

* A unique random encryption key
* A unique random initialization vector
* Authenticated encryption
* A versioned encryption format

Example encryption metadata:

```json
{
  "version": 1,
  "algorithm": "AES-GCM",
  "key_length": 256,
  "iv": "base64-encoded-initialization-vector"
}
```

The initialization vector is not secret, but it must not be reused with the same key.

### Key handling

The encryption key should not be sent to the backend in plaintext.

For the initial prototype, the frontend may include the decryption key in the URL fragment:

```text
https://example.com/share/secure-token#decryption-key
```

The fragment is processed by the browser and is not normally included in the HTTP request sent to the server.

The frontend can then:

1. Read the fragment locally.
2. Request the encrypted file from the backend.
3. Decrypt the file locally.

This design requires additional hardening for production because browser history, screenshots, copied links, malicious browser extensions, and compromised devices may expose the fragment.

### Backend responsibilities

The backend is responsible for:

* Authentication
* Authorization
* Token validation
* File storage
* Expiration checks
* Revocation
* Download limits
* Recipient verification
* Activity logging
* Rate limiting

The backend should not be responsible for:

* Decrypting files
* Handling plaintext file contents
* Storing plaintext encryption keys
* Logging encryption keys
* Inspecting sensitive file content

---

## Threat Model

### The system aims to protect against

* Unauthorized access to an active handoff
* Guessable share links
* Access after expiration
* Access after revocation
* Download-limit bypass attempts
* Database exposure of plaintext files
* Storage-provider exposure of plaintext files
* Password brute-force attempts
* Repeated verification-code guessing
* Basic token enumeration
* Unauthorized access to another user's handoffs

### The system does not fully protect against

* A compromised sender device
* A compromised recipient device
* Malware or keyloggers
* Malicious browser extensions
* Screenshots or manual copying
* A compromised frontend deployment
* A compromised server that modifies frontend JavaScript
* Weak recipient verification procedures
* User sharing the decryption key publicly
* Poor production infrastructure configuration

A production deployment would require an independent security review and a more advanced key-management design.

---

## Technology Stack

### Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* React Router
* Browser Web Crypto API
* Fetch API or Axios

### Backend

* Python
* Django
* Django REST Framework
* Simple JWT or an equivalent authentication system
* PostgreSQL
* Django storage system
* Optional S3-compatible object storage

### Development and deployment

* Git
* Docker
* Docker Compose
* Gunicorn
* Nginx or another reverse proxy
* HTTPS/TLS
* Optional background task system for cleanup jobs

---

## System Architecture

```text
┌─────────────────────────────┐
│      React Frontend         │
│                             │
│  - File selection           │
│  - AES-GCM encryption       │
│  - Client-side decryption   │
│  - User interface           │
└──────────────┬──────────────┘
               │ HTTPS REST API
               ▼
┌─────────────────────────────┐
│      Django REST API        │
│                             │
│  - Authentication           │
│  - Handoff management       │
│  - Access control           │
│  - Verification             │
│  - Expiration               │
│  - Activity logging         │
└──────────────┬──────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌───────────────┐
│ PostgreSQL  │  │ File Storage  │
│             │  │               │
│ Metadata    │  │ Ciphertext    │
│ Users       │  │ only          │
│ Events      │  │               │
└─────────────┘  └───────────────┘
```

---

## Project Structure

```text
keynest/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── handoffs/
│   │   │   ├── activity/
│   │   │   └── recipient/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── lib/
│   │   ├── router/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── config/
│   │   ├── settings/
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── accounts/
│   │   ├── handoffs/
│   │   ├── recipients/
│   │   ├── activity/
│   │   ├── storage/
│   │   └── common/
│   ├── manage.py
│   └── requirements.txt
│
├── docker-compose.yml
├── .gitignore
├── LICENSE
└── README.md
```

---

## User Flows

### Authentication flow

```text
Landing page
    ↓
Sign up
    ↓
Validate form
    ↓
Create account
    ↓
Sign in
    ↓
Dashboard
```

### Create handoff flow

```text
Dashboard
    ↓
Create handoff
    ↓
Select file
    ↓
Enter optional message
    ↓
Set expiration
    ↓
Set download limit
    ↓
Enable or disable recipient verification
    ↓
Review settings
    ↓
Encrypt file locally
    ↓
Upload encrypted file
    ↓
Generate share link
    ↓
Copy or share link
```

### Recipient flow

```text
Open share link
    ↓
Check link status
    ├── Invalid
    ├── Expired
    ├── Revoked
    ├── Download limit reached
    └── Active
    ↓
Complete verification if required
    ↓
Download encrypted file
    ↓
Decrypt locally
    ↓
Save file
```

---

## API Overview

Base URL:

```text
/api/
```

### Authentication

| Method | Endpoint                 | Description                |
| ------ | ------------------------ | -------------------------- |
| `POST` | `/auth/register/`        | Create an account          |
| `POST` | `/auth/login/`           | Authenticate a user        |
| `POST` | `/auth/logout/`          | End the current session    |
| `GET`  | `/auth/me/`              | Return the current user    |
| `POST` | `/auth/change-password/` | Change the user's password |

### Handoffs

| Method | Endpoint                   | Description                            |
| ------ | -------------------------- | -------------------------------------- |
| `GET`  | `/handoffs/`               | List the authenticated user's handoffs |
| `POST` | `/handoffs/`               | Create a handoff                       |
| `GET`  | `/handoffs/{id}/`          | View handoff details                   |
| `POST` | `/handoffs/{id}/revoke/`   | Revoke a handoff                       |
| `GET`  | `/handoffs/{id}/activity/` | View handoff activity                  |

### Recipient access

| Method | Endpoint                       | Description               |
| ------ | ------------------------------ | ------------------------- |
| `GET`  | `/share/{token}/status/`       | Check link status         |
| `POST` | `/share/{token}/request-code/` | Request verification code |
| `POST` | `/share/{token}/verify/`       | Verify recipient          |
| `GET`  | `/share/{token}/download/`     | Download encrypted file   |

### Activity

| Method | Endpoint     | Description                            |
| ------ | ------------ | -------------------------------------- |
| `GET`  | `/activity/` | List the authenticated user's activity |

---

## Example Create-Handoff Request

The frontend encrypts the selected file before making this request.

```http
POST /api/handoffs/
Authorization: Bearer <access-token>
Content-Type: multipart/form-data
```

Example fields:

```text
encrypted_file: encrypted-file.bin
original_file_name: confidential.pdf
file_size: 23892
encrypted_file_hash: <hash>
encrypted_metadata: <json>
message: Please review this document
expires_at: 2026-10-02T12:00:00Z
max_downloads: 1
verification_required: true
```

Example response:

```json
{
  "id": "handoff-uuid",
  "share_token": "generated-share-token",
  "expires_at": "2026-10-02T12:00:00Z",
  "status": "active"
}
```

The frontend may then construct a link containing the client-side decryption key:

```text
https://frontend.example.com/share/generated-share-token#decryption-key
```

---

## Data Model

```text
User
└── Handoff
    ├── Encrypted file
    ├── Share-token hash
    ├── Recipient verification records
    └── Activity events
```

### Main entities

#### User

Stores account information and authentication data.

#### Handoff

Stores:

* Owner
* Original file name
* File size
* Encrypted file location
* Encrypted-file hash
* Encryption metadata
* Expiration time
* Download limit
* Download count
* Verification requirement
* Status
* Share-token hash

#### VerificationCode

Stores:

* Handoff
* Hashed verification code
* Expiration time
* Attempt count
* Used timestamp

#### ActivityEvent

Stores:

* Handoff
* Event type
* Actor
* Timestamp
* Non-sensitive metadata

---

## Frontend Setup

### Requirements

* Node.js 20 or later
* npm, pnpm, or yarn

### Installation

```bash
cd frontend
npm install
```

### Environment variables

Create:

```text
frontend/.env.local
```

Example:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Start the development server

```bash
npm run dev
```

The frontend should be available at:

```text
http://localhost:5173
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

---

## Backend Setup

### Requirements

* Python 3.11 or later
* PostgreSQL
* Virtual environment
* Optional Docker installation

### Create the virtual environment

```bash
cd backend

python -m venv .venv
```

Activate it on Linux or macOS:

```bash
source .venv/bin/activate
```

Activate it on Windows:

```powershell
.venv\Scripts\activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Example `requirements.txt`

```text
Django
djangorestframework
djangorestframework-simplejwt
django-cors-headers
django-environ
psycopg[binary]
Pillow
```

Optional production dependencies:

```text
gunicorn
boto3
django-storages
celery
redis
```

### Run migrations

```bash
python manage.py migrate
```

### Create an administrator

```bash
python manage.py createsuperuser
```

### Start the backend

```bash
python manage.py runserver
```

The backend should be available at:

```text
http://localhost:8000
```

---

## Environment Variables

Create:

```text
backend/.env
```

Example:

```env
DEBUG=True
SECRET_KEY=replace-this-development-secret
ALLOWED_HOSTS=localhost,127.0.0.1

DATABASE_NAME=keynest
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432

FRONTEND_URL=http://localhost:5173

ACCESS_TOKEN_MINUTES=15
REFRESH_TOKEN_DAYS=7

MAX_UPLOAD_SIZE_MB=100
```

For production:

* Use a strong randomly generated secret key.
* Do not commit `.env` files.
* Use a managed secret store where possible.
* Disable debug mode.
* Use HTTPS.
* Restrict allowed hosts.
* Restrict CORS origins.

---

## Database Setup

Example PostgreSQL database creation:

```sql
CREATE DATABASE keynest;
CREATE USER keynest_user WITH PASSWORD 'replace-this-password';
GRANT ALL PRIVILEGES ON DATABASE keynest TO keynest_user;
```

Then configure the backend environment variables:

```env
DATABASE_NAME=keynest
DATABASE_USER=keynest_user
DATABASE_PASSWORD=replace-this-password
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

Run:

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Running the Complete Project

Open two terminal windows.

### Terminal 1: Backend

```bash
cd backend
source .venv/bin/activate
python manage.py runserver
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Testing

### Backend tests

```bash
cd backend
python manage.py test
```

Or, if using pytest:

```bash
pytest
```

Important backend tests include:

* Registration
* Login
* Unauthorized handoff access
* Handoff ownership
* Expiration
* Revocation
* Download limits
* Invalid share tokens
* Verification-code expiration
* Verification attempt limits
* Concurrent downloads
* File-size validation
* Activity logging

### Frontend tests

```bash
cd frontend
npm run test
```

Important frontend tests include:

* Encryption and decryption
* File-selection validation
* Handoff form validation
* Expired-link state
* Revoked-link state
* Verification failure state
* Upload progress
* Download errors

### Manual encryption test

The following should always be true:

```text
Encrypt(plaintext, key) → ciphertext
Decrypt(ciphertext, key) → original plaintext
Decrypt(ciphertext, wrong key) → failure
Decrypt(modified ciphertext, key) → failure
```

---

## Security Guidelines

### Do

* Use the Web Crypto API.
* Use AES-GCM with a unique random IV for every encryption operation.
* Use Django's password-hashing framework.
* Use HTTPS in production.
* Store only encrypted files.
* Hash share tokens before database storage.
* Hash verification codes before database storage.
* Use secure random values from a cryptographic random generator.
* Enforce access rules on the backend.
* Use database transactions for download-limit updates.
* Apply rate limits to login and verification endpoints.
* Validate file size and request data.
* Keep secrets in environment variables.
* Record security-relevant activity events.
* Use short-lived access tokens.

### Do not

* Create a custom encryption algorithm.
* Use plain SHA-256 for password storage.
* Store plaintext passwords.
* Store plaintext encryption keys on the server.
* Put passwords or encryption keys in logs.
* Trust frontend-only expiration checks.
* Trust frontend-only download limits.
* Allow unlimited CORS origins in production.
* Use predictable share tokens.
* Reuse AES-GCM IVs with the same key.
* Commit secrets to Git.
* Assume encryption protects a compromised device.
* Treat this project as production-ready without a security review.

---

## File Validation

The backend should validate:

* File exists
* File size
* Request authentication
* User ownership
* Metadata format
* Expiration date
* Download-limit value
* Share-token format

The backend should not rely only on the file extension or MIME type.

The frontend should also validate files for usability, but frontend validation is not a security boundary.

---

## Expiration and Cleanup

A handoff can be considered expired when:

```text
current_time >= expires_at
```

Expiration should be checked:

* When the status endpoint is called
* When verification is attempted
* When downloading
* When viewing handoff details
* During scheduled cleanup

A scheduled cleanup task may later remove:

* Expired encrypted files
* Expired verification codes
* Old activity records
* Revoked handoffs after a retention period

Possible future tools:

* Celery
* Redis
* Django management commands
* Cron jobs

---

## Limitations

KeyNest is an educational MVP and has important limitations.

### Browser-based key handling

If the decryption key is placed in a URL fragment, it may be exposed through:

* Browser history
* Screenshots
* Copied links
* Screen recording
* Malicious browser extensions
* Compromised devices
* User error

### Server compromise

A server that controls the frontend deployment could potentially serve malicious JavaScript. A malicious script could capture keys before encryption or during decryption.

### Recipient trust

Once a recipient decrypts a file, the application cannot prevent them from:

* Copying it
* Saving it elsewhere
* Taking a screenshot
* Sharing it with another person

### Metadata exposure

Even if file contents are encrypted, the backend may still know metadata such as:

* File name
* File size
* Creation time
* Expiration time
* Access events
* Download count
* Account ownership

A production privacy-focused version would need to minimize or encrypt more metadata.

---

## Future Roadmap

### Version 1: Educational MVP

* User authentication
* Client-side file encryption
* Encrypted file uploads
* Expiring links
* Download limits
* Verification codes
* Revocation
* Activity logs

### Version 2: Improved key management

* Public-key encryption
* Recipient key pairs
* Secure key wrapping
* Multi-recipient handoffs
* Better key recovery
* Safer link-sharing workflows

### Version 3: Team accounts

* Organizations
* Team members
* Roles and permissions
* Shared activity logs
* Organization policies
* Centralized access management

### Version 4: Developer tools

* Command-line interface
* REST API keys
* CI/CD integration
* Secure secret handoffs
* GitHub integration
* Webhooks

### Version 5: Enterprise capabilities

* Self-hosted deployment
* S3-compatible object storage
* Hardware security module support
* Enterprise identity providers
* Advanced audit reports
* Retention policies
* Compliance-oriented controls

### Version 6: Advanced cryptography

* Threshold key recovery
* Multi-party approval
* Hardware-backed keys
* Post-quantum cryptographic experimentation
* Formal security review

---

## Development Principles

KeyNest follows these principles:

1. Use proven cryptographic algorithms.
2. Keep encryption and decryption on the client where possible.
3. Treat the backend as an access-control and encrypted-storage service.
4. Make security decisions on the backend.
5. Minimize sensitive data collection.
6. Fail securely.
7. Make security behavior understandable to users.
8. Keep cryptographic code isolated and testable.
9. Prefer explicit expiration and revocation.
10. Document security limitations honestly.

---

## Contributing

Contributions are welcome.

### Contribution workflow

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Add or update tests.
5. Run the test suite.
6. Commit your changes.

```bash
git commit -m "Add your feature"
```

7. Push the branch.

```bash
git push origin feature/your-feature
```

8. Open a pull request.

### Contribution requirements

* Keep changes focused.
* Add tests for new behavior.
* Do not introduce custom cryptographic algorithms.
* Do not commit secrets.
* Document security-sensitive changes.
* Follow the existing project style.

---

## Responsible Disclosure

If a security vulnerability is discovered, do not publish exploit details immediately.

Report it privately to the project maintainer with:

* A description of the issue
* Affected component
* Steps to reproduce
* Potential impact
* Suggested remediation, if available

---

## License

This project is licensed under the MIT License.

See the `LICENSE` file for details.

---

## Project Status

KeyNest is currently an educational MVP under active development.

It is intended for:

* Learning encryption
* Practicing Django and DRF development
* Practicing React and TypeScript development
* Demonstrating secure file-sharing concepts
* Building a foundation for future product development

It should not be used for highly sensitive production data until it has undergone professional security testing, infrastructure hardening, and an independent cryptographic review.

---
