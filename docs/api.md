# API Documentation

> HasyDonate API Documentation

Version: 1.0

---

# 1. Overview

HasyDonate follows a **Server Action First** architecture.

Unlike traditional web applications, HasyDonate minimizes the use of REST APIs.

Business logic is executed through:

- React Server Components
- Server Actions
- Prisma ORM
- Supabase Storage

Route Handlers (`app/api`) are only used when absolutely necessary.

---

# 2. API Architecture

```
Browser

↓

React Components

↓

Server Actions

↓

Prisma ORM

↓

Supabase PostgreSQL

↓

Supabase Storage
```

---

# 3. API Principles

Every operation must be:

- Type-safe
- Server-side
- Validated
- Authenticated
- Authorized

Business logic should never exist inside Client Components.

---

# 4. Directory Structure

```
src/

server/

├── actions/

│   ├── donor/

│   ├── donation/

│   ├── settings/

│   ├── dashboard/

│   └── auth/

│

├── queries/

│   ├── donor/

│   ├── donation/

│   ├── dashboard/

│   └── reports/

│

└── validations/
```

---

# 5. Server Action Convention

Each Server Action should have one responsibility.

Example

```
createDonation()

updateDonation()

deleteDonation()

findDonatur()

createDonatur()

updateSettings()
```

Avoid large functions that perform multiple unrelated tasks.

---

# 6. Validation

Every Server Action must validate input using Zod.

Flow

```
Receive Input

↓

Validate

↓

Authorize

↓

Execute

↓

Return Result
```

Never write invalid data into the database.

---

# 7. Authentication

Authentication is provided by Supabase Auth.

Every Server Action must verify:

- User is authenticated
- User is active
- User has permission

---

# 8. Authorization

Roles

```
ADMIN

FRONT_ADMIN
```

Example

| Action | Front Admin | Admin |
|----------|:----------:|:----:|
| Create Donatur | ✅ | ✅ |
| Edit Donatur | ✅ | ✅ |
| Delete Donatur | ❌ | ✅ |
| Create Donation | ✅ | ✅ |
| Edit Donation | ✅ | ✅ |
| Settings | ❌ | ✅ |

---

# 9. Donatur Actions

## createDonatur()

Purpose

Create a new Donatur.

Validation

- Name required
- Address required
- Phone number required

Returns

```
Donatur
```

---

## updateDonatur()

Update Donatur information.

---

## searchDonatur()

Search by

- Phone Number
- Name

Returns

List of Donatur.

---

## getDonatur()

Returns

One Donatur.

---

# 10. Donation Actions

## createDonation()

Purpose

Record a new donation.

Validation

Donation Type

Payment Method

Amount

Transfer Proof (conditional)

Workflow

```
Validate

↓

Upload Proof

↓

Generate Donation Number

↓

Insert Donation

↓

Create Audit Log

↓

Return Donation
```

---

## updateDonation()

Update

- Notes
- Donation Type

Transfer proof

if necessary.

---

## getDonation()

Return donation detail.

---

## listDonations()

Supports

Pagination

Sorting

Filtering

Searching

---

# 11. Dashboard Actions

Dashboard statistics.

Functions

```
getDashboardSummary()

getTodayStatistics()

getMonthlyStatistics()

getDonationChart()

getRecentDonations()
```

---

# 12. Settings Actions

Administrator only.

Functions

```
getSettings()

updateSettings()
```

Settings include

Foundation

Bank

Receipt Footer

WhatsApp Template

---

# 13. Upload Actions

Purpose

Upload transfer proof.

Flow

```
Validate File

↓

Upload

↓

Return Path
```

Supported

```
JPG

JPEG

PNG

PDF
```

---

# 14. Query Layer

Business logic should never directly call Prisma from UI components.

Instead

```
Server Action

↓

Query Layer

↓

Prisma
```

Example

```
getDonationById()

listDonations()

searchDonatur()

dashboardSummary()
```

---

# 15. Error Handling

Never expose internal errors.

Bad

```
Prisma Error

Unknown Database Error
```

Good

```
Donation failed to save.

Phone number already exists.

Transfer proof required.
```

---

# 16. Response Standard

Every Server Action returns

Success

```
{
    success: true,
    data: ...
}
```

Failure

```
{
    success: false,
    error: "..."
}
```

Never throw business errors directly to Client Components.

---

# 17. Pagination

Default

```
20
```

Maximum

```
100
```

---

# 18. Filtering

Donations

- Date
- Donation Type
- Payment Method
- Staff

Donatur

- Name
- Phone Number

---

# 19. Sorting

Allowed

Date

Amount

Name

Newest

Oldest

---

# 20. Audit Logging

Automatically log

Create Donatur

Update Donatur

Create Donation

Update Donation

Print Receipt

Upload Transfer Proof

Update Settings

---

# 21. External APIs

Current Version

None

The application is fully internal.

Future integrations

- WhatsApp Business API
- Email Service
- SMS Gateway

---

# 22. Route Handlers

Use Route Handlers only for

```
PDF Download

Image Preview

Storage Access

Webhook

Health Check
```

Avoid creating REST APIs for CRUD operations.

---

# 23. Security

Every request must

Authenticate

Authorize

Validate

Sanitize

Log

Never trust client input.

---

# 24. Performance

Prefer

Server Components

Server Actions

Avoid

Client fetching

Duplicate queries

N+1 queries

---

# 25. API Summary

The HasyDonate API is built around Server Actions rather than traditional REST APIs.

The architecture prioritizes:

- Simplicity
- Type Safety
- Security
- Maintainability
- Performance

Every business operation flows through validated Server Actions before interacting with the database.