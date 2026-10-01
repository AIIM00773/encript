# Django + DRF Backend Structure

The backend should handle:

- User authentication
- Handoff metadata
- Encrypted file storage
- Secure share links
- Recipient verification
- Expiration and download limits
- Revocation
- Activity logging

The backend should **never receive or store the plaintext file or unprotected encryption key**.

## 1. Recommended project tree

```text
backend/
├── manage.py
├── requirements.txt
├── .env
├── .env.example
├── README.md
│
├── config/
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   │
│   ├── urls.py
│   ├── asgi.py
│   ├── wsgi.py
│   └── api.py
│
├── apps/
│   ├── accounts/
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── permissions.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   ├── services.py
│   │   ├── tests/
│   │   │   ├── test_auth.py
│   │   │   └── test_permissions.py
│   │   └── tokens.py
│   │
│   ├── handoffs/
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── permissions.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   ├── services.py
│   │   ├── validators.py
│   │   ├── tasks.py
│   │   └── tests/
│   │       ├── test_models.py
│   │       ├── test_views.py
│   │       ├── test_expiration.py
│   │       └── test_download_limits.py
│   │
│   ├── recipients/
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   ├── services.py
│   │   ├── verification.py
│   │   └── tests/
│   │       ├── test_verification.py
│   │       └── test_recipient_access.py
│   │
│   ├── activity/
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   └── tests/
│   │
│   ├── storage/
│   │   ├── __init__.py
│   │   ├── backends.py
│   │   ├── validators.py
│   │   └── services.py
│   │
│   └── common/
│       ├── __init__.py
│       ├── permissions.py
│       ├── exceptions.py
│       ├── pagination.py
│       ├── throttling.py
│       └── utilities.py
│
├── media/
└── tests/
    ├── test_api_flow.py
    └── test_security.py
```

# 2. Django applications

## `accounts`

Responsible for:

- Registration
- Login
- Logout
- Password changes
- Current-user information
- Authentication tokens
- Account permissions

## `handoffs`

Responsible for:

- Creating handoffs
- Storing encrypted files
- Handoff metadata
- Expiration
- Revocation
- Download limits
- Handoff ownership

## `recipients`

Responsible for:

- Public share-link access
- One-time verification codes
- Recipient sessions
- Download authorization
- Recipient-facing handoff information

## `activity`

Responsible for:

- Access events
- Download events
- Verification attempts
- Revocation events
- Expiration events

## `storage`

Responsible for:

- Encrypted file upload
- Encrypted file retrieval
- File-size validation
- Storage backend configuration

# 3. Database model tree

```text
User
└── Handoff
    ├── EncryptedFile
    ├── RecipientAccess
    │   └── VerificationCode
    └── ActivityEvent
```

A handoff belongs to one authenticated sender.

## User model

Use Django’s built-in user model or create a custom user model before the first migration.

```python
# apps/accounts/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)

    def __str__(self) -> str:
        return self.email
```

In `settings/base.py`:

```python
AUTH_USER_MODEL = "accounts.User"
```

## Handoff model

```python
# apps/handoffs/models.py

import uuid

from django.conf import settings
from django.db import models


class HandoffStatus(models.TextChoices):
    ACTIVE = "active", "Active"
    EXPIRED = "expired", "Expired"
    REVOKED = "revoked", "Revoked"
    DOWNLOAD_LIMIT_REACHED = (
        "download_limit_reached",
        "Download limit reached",
    )


class Handoff(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="handoffs",
    )

    original_file_name = models.CharField(max_length=255)
    file_size = models.PositiveBigIntegerField()

    encrypted_file = models.FileField(
        upload_to="encrypted-handoffs/%Y/%m/%d/"
    )

    encrypted_file_hash = models.CharField(max_length=128)

    encrypted_metadata = models.JSONField(
        default=dict,
        blank=True,
    )

    message = models.TextField(blank=True)

    status = models.CharField(
        max_length=32,
        choices=HandoffStatus.choices,
        default=HandoffStatus.ACTIVE,
    )

    expires_at = models.DateTimeField()
    max_downloads = models.PositiveIntegerField(null=True, blank=True)
    download_count = models.PositiveIntegerField(default=0)

    verification_required = models.BooleanField(default=False)

    share_token_hash = models.CharField(
        max_length=128,
        unique=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["owner", "-created_at"]),
            models.Index(fields=["status", "expires_at"]),
        ]

    def __str__(self):
        return self.original_file_name
```

The database should store a **hash of the share token**, not the raw token.

## Encrypted metadata

The `encrypted_metadata` field may contain information such as:

```json
{
  "algorithm": "AES-GCM-256",
  "iv": "base64-encoded-iv",
  "encrypted_file_key": "base64-encoded-key",
  "version": 1
}
```

For a stronger zero-knowledge-style design, the encryption key should be placed in the URL fragment:

```text
https://keynest.example/share/abc123#decryption-key
```

The fragment after `#` is processed by the browser and is not normally sent to the server in the HTTP request.

The frontend can:

1. Read the key from `window.location.hash`
2. Request the encrypted file from the backend
3. Decrypt the file locally

The server can authorize access without receiving the plaintext key.

## Activity model

```python
# apps/activity/models.py

from django.conf import settings
from django.db import models


class ActivityType(models.TextChoices):
    CREATED = "created", "Created"
    OPENED = "opened", "Opened"
    VERIFICATION_SUCCESS = (
        "verification_success",
        "Verification successful",
    )
    VERIFICATION_FAILED = (
        "verification_failed",
        "Verification failed",
    )
    DOWNLOADED = "downloaded", "Downloaded"
    REVOKED = "revoked", "Revoked"
    EXPIRED = "expired", "Expired"


class ActivityEvent(models.Model):
    handoff = models.ForeignKey(
        "handoffs.Handoff",
        on_delete=models.CASCADE,
        related_name="activity_events",
    )

    event_type = models.CharField(
        max_length=40,
        choices=ActivityType.choices,
    )

    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    # Avoid storing sensitive values here.
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]
```

Do not store:

- Passwords
- Decryption keys
- Plaintext messages
- Complete IP addresses unless you have a clear security and legal reason
- File contents
- Verification codes

# 4. API endpoint tree

```text
/api/
├── auth/
│   ├── POST   register/
│   ├── POST   login/
│   ├── POST   logout/
│   ├── GET    me/
│   ├── POST   change-password/
│   └── POST   refresh/
│
├── handoffs/
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /{handoff_id}/
│   ├── POST   /{handoff_id}/revoke/
│   ├── POST   /{handoff_id}/regenerate-link/
│   ├── GET    /{handoff_id}/activity/
│   └── GET    /{handoff_id}/download/
│
├── share/
│   └── /{share_token}/
│       ├── GET    status/
│       ├── POST   verify/
│       ├── POST   request-code/
│       ├── GET    metadata/
│       └── GET    download/
│
├── activity/
│   └── GET    /
│
└── settings/
    ├── GET    /
    └── PATCH  /
```

# 5. Frontend-to-backend flow mapping

| UI screen | API endpoint | Authentication |
|---|---|---|
| Signup | `POST /api/auth/register/` | Public |
| Login | `POST /api/auth/login/` | Public |
| Dashboard | `GET /api/handoffs/` | Required |
| Create handoff | `POST /api/handoffs/` | Required |
| Handoff details | `GET /api/handoffs/{id}/` | Owner only |
| Revoke handoff | `POST /api/handoffs/{id}/revoke/` | Owner only |
| Activity page | `GET /api/activity/` | Required |
| Public share page | `GET /api/share/{token}/status/` | Public |
| Verification | `POST /api/share/{token}/verify/` | Public |
| Recipient metadata | `GET /api/share/{token}/metadata/` | Public or verified |
| Recipient download | `GET /api/share/{token}/download/` | Verified if required |
| Settings | `GET/PATCH /api/settings/` | Required |

# 6. Create-handoff request

The frontend encrypts the file before sending it.

```http
POST /api/handoffs/
Content-Type: multipart/form-data
Authorization: Bearer <access-token>
```

Example form fields:

```text
encrypted_file: encrypted-file.bin
original_file_name: confidential.pdf
file_size: 23892
encrypted_file_hash: ...
encrypted_metadata: {...}
message: Review this document
expires_at: 2026-10-02T12:00:00Zmax_downloads: 1
verification_required: true
```

The backend should validate:

- File exists
- File size is within the limit
- Expiration is in the future
- Download limit is valid
- Metadata is valid JSON
- The uploaded file is treated as encrypted binary data

Example serializer:

```python
# apps/handoffs/serializers.py

from rest_framework import serializers

from .models import Handoff


class HandoffCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Handoff
        fields = [
            "original_file_name",
            "file_size",
            "encrypted_file",
            "encrypted_file_hash",
            "encrypted_metadata",
            "message",
            "expires_at",
            "max_downloads",
            "verification_required",
        ]

    def validate_file_size(self, value):
        max_size = 100 * 1024 * 1024  # 100 MB

        if value <= 0:
            raise serializers.ValidationError(
                "File size must be greater than zero."
            )

        if value > max_size:
            raise serializers.ValidationError(
                "File size exceeds the maximum allowed size."
            )

        return value
```

# 7. Handoff service layer

Keep business logic out of the views.

```python
# apps/handoffs/services.py

import hashlib
import secrets

from django.utils import timezone

from apps.activity.models import ActivityEvent, ActivityType
from .models import Handoff


def generate_share_token() -> tuple[str, str]:
    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(
        raw_token.encode("utf-8")
    ).hexdigest()

    return raw_token, token_hash


def create_handoff(*, owner, validated_data):
    raw_token, token_hash = generate_share_token()

    handoff = Handoff.objects.create(
        owner=owner,
        share_token_hash=token_hash,
        **validated_data,
    )

    ActivityEvent.objects.create(
        handoff=handoff,
        actor=owner,
        event_type=ActivityType.CREATED,
    )

    return handoff, raw_token
```

The raw token should be returned only once when the handoff is created. It should not be stored in the database.

# 8. Handoff URLs

After creating a handoff, the backend can return:

```json
{
  "id": "handoff-uuid",
  "share_token": "one-time-generated-token",
  "share_url": "https://frontend.example/share/token#encrypted-key",
  "expires_at": "2026-10-02T12:00:00Z",
  "status": "active"
}
```

For the MVP, the frontend can construct the final URL:

```typescript
const shareUrl = `${frontendBaseUrl}/share/${shareToken}#${decryptionKey}`;
```

The backend should only know the path token:

```text
/share/token
```

The backend should not receive the fragment:

```text
#decryption-key
```

# 9. Public recipient flow

```text
GET /api/share/{share_token}/status/
    ↓
Validate token hash
    ↓
Check whether handoff exists
    ↓
Check expiration
    ↓
Check revocation
    ↓
Check download limit
    ↓
Return current status
```

Example response:

```json
{
  "status": "active",
  "file_name": "confidential.pdf",
  "file_size": 23892,
  "expires_at": "2026-10-02T12:00:00Z",
  "verification_required": true,
  "download_count": 0,
  "max_downloads": 1
}
```

Do not return:

- The original plaintext file
- The unprotected decryption key
- The owner’s private information
- Internal database IDs unnecessarily

# 10. Verification flow

For the MVP, use a one-time verification code.

```text
Recipient opens share link
    ↓
POST /api/share/{token}/request-code/
    ↓
Backend creates temporary verification code
    ↓
Code is sent through configured delivery method
    ↓
Recipient submits code
    ↓
POST /api/share/{token}/verify/
    ↓
Backend creates short-lived recipient access token
    ↓
Frontend uses token to download encrypted file
```

Example verification request:

```json
{
  "code": "482913"
}
```

Example response:

```json
{
  "verified": true,
  "recipient_access_token": "temporary-token",
  "expires_in": 600
}
```

For development, you can display the code in the terminal instead of implementing email delivery.

Never store the verification code in plaintext. Store a hash:

```python
import hashlib


def hash_code(code: str) -> str:
    return hashlib.sha256(
        code.encode("utf-8")
    ).hexdigest()
```

A verification code model could look like this:

```python
# apps/recipients/models.py

import uuid

from django.db import models


class VerificationCode(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    handoff = models.ForeignKey(
        "handoffs.Handoff",
        on_delete=models.CASCADE,
        related_name="verification_codes",
    )

    code_hash = models.CharField(max_length=128)

    expires_at = models.DateTimeField()
    attempts = models.PositiveIntegerField(default=0)
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

# 11. Download authorization

The download endpoint must perform all checks again. Do not rely only on the frontend.

```text
GET /api/share/{share_token}/download/
    ↓
Validate share token
    ↓
Check recipient access token
    ↓
Check handoff status
    ↓
Check expiration
    ↓
Check download limit
    ↓
Increment download count safely
    ↓
Create activity event
    ↓
Return encrypted file
```

Use a database transaction to prevent two simultaneous requests from bypassing the download limit.

```python
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied

from .models import Handoff, HandoffStatus


@transaction.atomic
def authorize_download(handoff_id):
    handoff = (
        Handoff.objects
        .select_for_update()
        .get(id=handoff_id)
    )

    if handoff.status != HandoffStatus.ACTIVE:
        raise PermissionDenied("This handoff is unavailable.")

    if handoff.expires_at <= timezone.now():
        handoff.status = HandoffStatus.EXPIRED
        handoff.save(update_fields=["status"])
        raise PermissionDenied("This handoff has expired.")

    if (
        handoff.max_downloads is not None
        and handoff.download_count >= handoff.max_downloads
    ):
        handoff.status = HandoffStatus.DOWNLOAD_LIMIT_REACHED
        handoff.save(update_fields=["status"])
        raise PermissionDenied("Download limit reached.")

    handoff.download_count += 1

    if (
        handoff.max_downloads is not None
        and handoff.download_count >= handoff.max_downloads
    ):
        handoff.status = HandoffStatus.DOWNLOAD_LIMIT_REACHED

    handoff.save(update_fields=["download_count", "status"])

    return handoff
```

# 12. URL configuration

## Main URL configuration

```python
# config/urls.py

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/handoffs/", include("apps.handoffs.urls")),
    path("api/share/", include("apps.recipients.urls")),
    path("api/activity/", include("apps.activity.urls")),
]
```

## Handoff URLs

```python
# apps/handoffs/urls.py

from django.urls import path

from .views import (
    HandoffDetailView,
    HandoffListCreateView,
    HandoffRevokeView,
)

urlpatterns = [
    path(
        "",
        HandoffListCreateView.as_view(),
        name="handoff-list-create",
    ),
    path(
        "<uuid:handoff_id>/",
        HandoffDetailView.as_view(),
        name="handoff-detail",
    ),
    path(
        "<uuid:handoff_id>/revoke/",
        HandoffRevokeView.as_view(),
        name="handoff-revoke",
    ),
]
```

## Recipient URLs

```python
# apps/recipients/urls.py

from django.urls import path

from .views import (
    ShareStatusView,
    RequestVerificationCodeView,
    VerifyRecipientView,
    RecipientDownloadView,
)

urlpatterns = [
    path(
        "<str:share_token>/status/",
        ShareStatusView.as_view(),
        name="share-status",
    ),
    path(
        "<str:share_token>/request-code/",
        RequestVerificationCodeView.as_view(),
        name="request-code",
    ),
    path(
        "<str:share_token>/verify/",
        VerifyRecipientView.as_view(),
        name="verify-recipient",
    ),
    path(
        "<str:share_token>/download/",
        RecipientDownloadView.as_view(),
        name="recipient-download",
    ),
]
```

# 13. Authentication recommendation

For the React frontend, use:

- Short-lived access tokens
- Refresh tokens
- HTTPS only in production
- Secure, `HttpOnly` cookies for refresh tokens
- CSRF protection if using cookie-based authentication
- DRF throttling on login and verification endpoints

A possible package setup:

```text
Django
djangorestframework
djangorestframework-simplejwt
django-cors-headers
django-environ
psycopg[binary]
```

Example DRF configuration:

```python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "30/minute",
        "user": "120/minute",
    },
}
```

# 14. Security settings

```python
# config/settings/production.py

DEBUG = False

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"
SECURE_REFERRER_POLICY = "no-referrer"
```

Configure CORS only for your frontend domain:

```python
CORS_ALLOWED_ORIGINS = [
    "https://app.example.com",
]
```

Do not use:

```python
CORS_ALLOW_ALL_ORIGINS = True
```

in production.

# 15. Recommended MVP backend milestones

```text
Milestone 1: Project foundation
├── Django configuration
├── DRF setup
├── PostgreSQL connection
├── Environment variables
└── CORS configuration

Milestone 2: Authentication
├── Custom user model
├── Registration
├── Login
├── Logout
└── Protected routes

Milestone 3: Handoff creation
├── Handoff model
├── Encrypted file upload
├── Metadata storage
├── Share token generation
└── Dashboard API

Milestone 4: Recipient access
├── Public token lookup
├── Expiration checks
├── Verification code
├── Temporary access token
└── Encrypted-file download

Milestone 5: Handoff management
├── Handoff details
├── Revoke endpoint
├── Download limits
├── Activity events
└── Expiration handling

Milestone 6: Testing and hardening
├── Authentication tests
├── Permission tests
├── Expiration tests
├── Download-limit tests
├── Token tests
├── File-size tests
└── Concurrent-download tests
```

# 16. Simplified final architecture

```text
React + Vite + TypeScript + Tailwind
                |
                | HTTPS + REST/JSON
                v
Django REST Framework API
                |
       ┌────────┼────────┐
       v        v        v
 PostgreSQL  File storage  Token/Auth service
       |
       v
Encrypted metadata and audit events

Browser:
- Generates encryption key
- Encrypts file with AES-GCM
- Decrypts file
- Holds decryption key temporarily

Backend:
- Stores encrypted file
- Stores encrypted metadata
- Validates access
- Handles expiration and revocation
- Records activity
- Never handles plaintext file contents
```

The most important compatibility rule is that the frontend and backend must agree on the encryption payload format:

```json
{
  "algorithm": "AES-GCM",
  "version": 1,
  "iv": "base64-encoded-initialization-vector",
  "ciphertext": "stored-as-uploaded",
  "original_file_name": "confidential.pdf"
}
```

Start with normal Django file storage during development. Once the MVP works, move encrypted files to object storage such as S3-compatible storage and add background tasks for automatic expiration cleanup.