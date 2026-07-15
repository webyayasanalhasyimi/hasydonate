# Database Design

> HasyDonate Database Documentation

Version: 1.0

---

# 1. Overview

HasyDonate uses **Supabase PostgreSQL** as its primary database with **Prisma ORM** as the database access layer.

The database is designed based on the following principles:

- Normalize Donatur information
- Prevent duplicate Donatur records
- Maintain immutable donation history
- Generate traceable Kwitansi
- Support future scalability
- Keep the schema simple and maintainable
- Ensure data integrity

The system is developed for the internal staff of Yayasan Panti Asuhan Al-Hasyimi to efficiently manage Donatur data, donation transactions, and receipt generation.

---

# 2. Technology Stack

| Item | Technology |
|------|------------|
| Database | PostgreSQL |
| Provider | Supabase |
| ORM | Prisma |
| Primary Key | UUID |
| Timestamp | timestamptz |
| Storage | Supabase Storage |
| Authentication | Supabase Auth |
| Soft Delete | Supported |
| Timezone | Asia/Jakarta (UTC+7) |

---

# 3. Database Principles

The database follows these principles.

## Single Source of Truth

Every **Donatur** exists only once.

Future donations always reference the existing Donatur record.

---

## Immutable Donation History

Donation transactions should **never** be deleted.

Every donation represents a historical financial transaction.

---

## Normalization

Avoid duplicated information whenever possible.

Examples:

- Donatur information stored once
- Foundation settings stored once
- Kwitansi generated from donation data
- Transfer proof stored in Supabase Storage

---

## Simplicity

Only create additional tables when they provide clear business value.

Avoid overengineering.

---

# 4. Entity Relationship Diagram

```text
                 ┌─────────────┐
                 │  Profiles   │
                 └──────┬──────┘
                        │
                        │ creates
                        ▼
                 ┌─────────────┐
                 │ Donations   │
                 └──────┬──────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
     Donors         Receipts      Audit Logs

                 Settings
```

---

# 5. Database Tables

Current tables

```text
profiles

donors

donations

receipts

audit_logs

settings
```

Future tables

```text
attachments

notifications

branches

monthly_reports
```

---

# 6. Table: profiles

Stores application users.

Authentication is managed by Supabase Auth.

Additional information is stored in this table.

---

## Columns

| Column | Type | Description |
|---------|------|-------------|
| id | UUID | Primary Key (same as auth.users.id) |
| full_name | VARCHAR(100) | User full name |
| email | VARCHAR(255) | Email address |
| role | ENUM | User role |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMPTZ | Record created timestamp |
| updated_at | TIMESTAMPTZ | Record updated timestamp |

---

## Role Enum

```text
ADMIN

FRONT_ADMIN
```

---

## Responsibilities

### ADMIN

Can access

- Dashboard
- Reports
- User Management
- Donatur Management
- Donation Management
- Receipt Management
- Settings

---

### FRONT_ADMIN

Can access

- Dashboard
- Search Donatur
- Register Donatur
- Create Donation
- Generate Kwitansi
- Print Kwitansi
- Share Kwitansi via WhatsApp

---

# 7. Table: donors

Stores **Donatur** information.

One Donatur may have multiple donation transactions.

Each Donatur should only have **one** record in the system.

---

## Columns

| Column | Type | Description |
|---------|------|-------------|
| id | UUID | Primary Key |
| full_name | VARCHAR(150) | Donatur full name |
| address | TEXT | Donatur address |
| phone_number | VARCHAR(20) | Phone / WhatsApp number |
| created_at | TIMESTAMPTZ | Record created timestamp |
| updated_at | TIMESTAMPTZ | Record updated timestamp |
| deleted_at | TIMESTAMPTZ | Soft delete timestamp |

---

## Business Rules

Phone number should be unique whenever possible.

Searching Donatur should prioritize:

1. Phone Number
2. Full Name

---

## Example

```text
Full Name

Muhammad Ade Dzakwan

Address

Jl. Kedung Tomas II No. 26A
Surabaya

Phone Number

081234567890
```

---

# 8. Table: donations

Stores every donation transaction.

This is the most important table in the application.

Each donation transaction produces one Kwitansi.

---

## Columns

| Column | Type | Description |
|---------|------|-------------|
| id | UUID | Primary Key |
| donation_number | VARCHAR(30) | Unique donation number |
| donor_id | UUID | Reference to Donatur |
| donation_type | ENUM | Donation category |
| payment_method | ENUM | Payment method |
| amount | DECIMAL(15,2) | Donation amount |
| notes | TEXT | Additional notes |
| transfer_proof_path | TEXT | File path in Supabase Storage |
| transfer_proof_filename | VARCHAR(255) | Original uploaded filename |
| transfer_uploaded_at | TIMESTAMPTZ | Upload timestamp |
| donation_date | TIMESTAMPTZ | Donation date |
| received_by | UUID | Staff who recorded the donation |
| created_at | TIMESTAMPTZ | Record created timestamp |
| updated_at | TIMESTAMPTZ | Record updated timestamp |

---

## Donation Type

```text
ZAKAT

SHADAQAH

SUMBANGAN_LAIN
```

---

## Payment Method

```text
CASH

BANK_TRANSFER
```

---

## Business Rules

### Cash

- Transfer proof must be NULL.

---

### Bank Transfer

Transfer proof is mandatory.

The uploaded file is stored in Supabase Storage.

Supported formats

```text
JPG

JPEG

PNG

PDF
```

Maximum file size

```text
10 MB
```

---

## Donation Number Format

```text
AH-DON-YYYYMMDD-XXXX
```

Example

```text
AH-DON-20260715-0001
```

Explanation

```text
AH
↓

Al-Hasyimi

DON
↓

Donation

YYYYMMDD
↓

Transaction Date

XXXX
↓

Daily Running Number
```

---

# 9. Relationships

## Donatur

```text
One Donatur

↓

Many Donations
```

---

## User

```text
One User

↓

Many Donations
```

---

## Donation

```text
One Donation

↓

One Receipt
```

---

## Data Relationship

```text
Donatur

↓

Donation

↓

Receipt
```

The same Donatur record is reused for every future donation transaction.

Donation history must never be duplicated.

---

# 10. Donation Workflow

```text
Search Donatur
        │
        ▼
Donatur Found?
   ┌────┴────┐
   │         │
 Yes        No
   │         │
   │   Register New Donatur
   └────┬────┘
        ▼
Select Donation Type
        ▼
Select Payment Method
        │
   ┌────┴─────────────┐
   │                  │
 Cash          Bank Transfer
   │                  │
   │           Upload Transfer Proof
   │                  │
   └────────┬─────────┘
            ▼
      Input Donation Amount
            ▼
      Optional Notes
            ▼
      Save Donation
            ▼
     Generate Kwitansi
            ▼
 ┌──────────┼────────────┐
 │          │            │
 ▼          ▼            ▼
Download   Print    Share via WhatsApp
 PDF         A5
```

---

# 11. Table: audit_logs

Stores important system activities.

Audit logs provide traceability for every important action performed within the application.

This table should only be written by the application.

Users are never allowed to modify or delete audit logs.

---

## Columns

| Column | Type | Description |
|---------|------|-------------|
| id | UUID | Primary Key |
| user_id | UUID | User performing the action |
| action | VARCHAR(50) | Action type |
| table_name | VARCHAR(50) | Affected table |
| record_id | UUID | Related record ID |
| old_value | JSONB | Previous data |
| new_value | JSONB | Updated data |
| created_at | TIMESTAMPTZ | Action timestamp |

---

## Example Actions

```text
LOGIN

LOGOUT

CREATE_DONATUR

UPDATE_DONATUR

DELETE_DONATUR

CREATE_DONATION

UPDATE_DONATION

DELETE_DONATION

PRINT_RECEIPT

DOWNLOAD_RECEIPT

SHARE_RECEIPT_WHATSAPP

UPLOAD_TRANSFER_PROOF

UPDATE_SETTINGS
```

---

## Purpose

Audit logs provide accountability.

Administrators can determine:

- Who created a donation
- Who edited donor information
- Who uploaded transfer proof
- Who printed a receipt
- Who shared a receipt via WhatsApp
- Who modified application settings

---

# 12. Table: settings

Stores global application configuration.

The application should never hardcode organization information.

All configurable values should be loaded from this table.

Only administrators can update these settings.

---

## Columns

| Column | Type | Description |
|---------|------|-------------|
| key | VARCHAR(100) | Configuration key |
| value | TEXT | Configuration value |
| updated_at | TIMESTAMPTZ | Last updated |

---

## Initial Settings

| Key | Value |
|-----|-------|
| orphanage_name | Yayasan Panti Asuhan Al-Hasyimi |
| orphanage_address | JL. Kedung Tomas II No. 26 A Surabaya |
| receipt_footer | Jazakumullahu Khairan Katsiran |
| receipt_prefix | AH |
| whatsapp_template | Default WhatsApp message |
| bank_name | BSI |
| bank_account | 1106060618 |
| bank_account_name | YAYASAN PANTI ASUHAN AL HASYIMI |

---

## Why Use Settings?

Changing information such as:

- Bank Account
- Foundation Name
- Receipt Footer
- WhatsApp Template

should not require modifying application code.

---

# 13. Relationships Summary

```text
Profiles (1)
      │
      ▼
Donations (N)
      ▲
      │
Donors (1)

Profiles (1)
      │
      ▼
Audit Logs (N)

Settings
```

---

# 14. Database Index Strategy

Indexes improve search performance and reporting.

---

## Donors

Create indexes on

```text
phone_number

full_name
```

Reason

- Fast donor search
- Prevent duplicate records

---

## Donations

Create indexes on

```text
donation_number

donation_date

donor_id

received_by

donation_type

payment_method
```

Reason

- Dashboard
- Reports
- Transaction history
- Daily statistics

---

## Audit Logs

Create indexes on

```text
created_at

user_id

action
```

Reason

- Activity history
- User tracking
- Audit reports

---

# 15. Database Constraints

## Donors

Phone number should be unique whenever possible.

---

## Donations

Donation number must be unique.

---

Donation amount must always be greater than zero.

```text
amount > 0
```

---

Donation Type

Allowed values

```text
ZAKAT

SHADAQAH

SUMBANGAN_LAIN
```

---

Payment Method

Allowed values

```text
CASH

BANK_TRANSFER
```

---

Transfer Proof Rules

If

```text
payment_method = BANK_TRANSFER
```

Then

```text
transfer_proof_path

transfer_proof_filename

transfer_uploaded_at
```

must NOT be NULL.

---

If

```text
payment_method = CASH
```

Those fields must be NULL.

---

# 16. Soft Delete Strategy

Not every table requires soft delete.

| Table | Soft Delete |
|---------|------------|
| donors | ✅ |
| donations | ❌ |
| profiles | ❌ |
| audit_logs | ❌ |
| settings | ❌ |

---

## Donors

Instead of deleting a donor permanently,

```text
deleted_at = CURRENT_TIMESTAMP
```

Reason

Donation history should remain valid forever.

---

## Donations

Donations should never be deleted.

If a transaction was entered incorrectly,

Create an audit log and update the record instead.

---

# 17. Naming Convention

## Tables

Plural nouns

```text
profiles

donors

donations

audit_logs

settings
```

---

## Primary Key

```text
id
```

---

## Foreign Keys

```text
donor_id

received_by

user_id
```

---

## Timestamp Fields

```text
created_at

updated_at

deleted_at
```

---

## Boolean Fields

Always begin with

```text
is_
```

Examples

```text
is_active
```

---

# 18. Numbering Strategy

## Donation Number

Format

```text
AH-DON-YYYYMMDD-XXXX
```

Example

```text
AH-DON-20260715-0001
```

---

The running number resets every day.

Example

```text
2026-07-15

0001

0002

0003
```

Next day

```text
2026-07-16

0001
```

---

# 19. File Storage Strategy

All uploaded files are stored in **Supabase Storage**.

The PostgreSQL database only stores metadata.

---

## Storage Bucket

```text
transfer-proofs
```

---

## Folder Structure

```text
transfer-proofs/

2026/

07/

AH-DON-20260715-0001.jpg
```

---

## Allowed File Types

```text
JPG

JPEG

PNG

PDF
```

---

## Maximum File Size

```text
10 MB
```

---

## Why Supabase Storage?

Benefits

- Faster database performance
- Smaller database size
- Easier backups
- Better scalability
- Built-in CDN
- Secure access control

---

# 20. Data Retention Policy

The application stores historical donation data permanently.

No donation history should be removed.

---

Donor information may be archived using soft delete.

---

Audit logs should never be modified or deleted.

---

Transfer proof files should remain available as long as the related donation exists.

---

# 21. Database Summary

The HasyDonate database is designed with the following principles:

- Simple
- Normalized
- Secure
- Maintainable
- Auditable
- Scalable

The database separates business data from generated documents.

Donation transactions are the single source of truth.

Receipts (Kwitansi) are generated dynamically from donation data and do not require a dedicated database table.

---

# 22. Row Level Security (RLS)

HasyDonate uses **Supabase Authentication** with **Row Level Security (RLS)** enabled on all tables.

Although all database operations are performed through **Server Actions**, RLS should remain enabled as an additional security layer.

---

## RLS Principles

- Deny access by default.
- Allow authenticated users only.
- Restrict access based on user roles.
- Never expose sensitive data to anonymous users.

---

## Access Matrix

| Resource | Front Admin | Admin |
|----------|:-----------:|:-----:|
| View Donatur | ✅ | ✅ |
| Create Donatur | ✅ | ✅ |
| Update Donatur | ✅ | ✅ |
| Delete Donatur | ❌ | ✅ |
| View Donation | ✅ | ✅ |
| Create Donation | ✅ | ✅ |
| Update Donation | ✅ | ✅ |
| Delete Donation | ❌ | ✅ |
| Upload Transfer Proof | ✅ | ✅ |
| View Audit Logs | ❌ | ✅ |
| Update Settings | ❌ | ✅ |

---

# 23. Storage Security

Transfer proof files are stored in **Supabase Storage**.

The storage bucket should be configured as:

```text
Private
```

Files must never be publicly accessible.

Downloads should be generated using signed URLs.

---

## Storage Bucket

```text
transfer-proofs
```

---

## Recommended Folder Structure

```text
transfer-proofs/

2026/

07/

AH-DON-20260715-0001.jpg
```

---

## Allowed MIME Types

```text
image/jpeg

image/png

application/pdf
```

---

## Maximum Upload Size

```text
10 MB
```

---

# 24. Backup Strategy

The application relies on Supabase PostgreSQL.

Recommended backup schedule:

| Type | Frequency |
|------|-----------|
| Database Backup | Daily |
| Storage Backup | Weekly |
| Configuration Export | Monthly |

---

## Backup Scope

Include:

- Donatur
- Donations
- Audit Logs
- Settings
- Transfer Proof Files

---

# 25. Performance Strategy

The system is expected to remain responsive even as donation history grows.

---

## Database

Always query only the required columns.

Avoid:

```sql
SELECT *
```

Instead:

```sql
SELECT
id,
full_name,
phone_number
FROM donors;
```

---

## Pagination

Large datasets should always use pagination.

Recommended page size:

```text
20
```

or

```text
50
```

records.

---

## Searching

Search Donatur by:

1. Phone Number
2. Full Name

Use indexed columns whenever possible.

---

## Dashboard

Dashboard statistics should use aggregate queries.

Avoid loading all donations into application memory.

---

# 26. Prisma Guidelines

Use Prisma as the only ORM.

Never execute raw SQL unless absolutely necessary.

---

## Preferred Query Style

```ts
await prisma.donation.findMany({
  where: {
    donationType: "ZAKAT"
  }
})
```

---

## Avoid

Complex raw SQL.

Duplicate business logic.

Database logic inside React components.

---

# 27. Data Validation

Every input must be validated before reaching the database.

Validation should occur in Server Actions.

Use **Zod** schemas.

---

## Donatur Validation

- Name required
- Phone number required
- Address required

---

## Donation Validation

- Donation Type required
- Payment Method required
- Amount greater than zero

---

## Bank Transfer Validation

If

```text
payment_method = BANK_TRANSFER
```

Transfer proof is required.

---

# 28. File Upload Guidelines

Transfer proof uploads should follow these steps:

```text
Validate File
      │
      ▼
Check MIME Type
      │
      ▼
Check File Size
      │
      ▼
Upload to Supabase Storage
      │
      ▼
Save File Path
      │
      ▼
Create Donation
```

Never save uploaded files before validation succeeds.

---

# 29. Transaction Flow

Every donation creation should be treated as a single transaction.

```text
Create Donation

↓

Upload Transfer Proof (if required)

↓

Generate Donation Number

↓

Save Donation

↓

Write Audit Log

↓

Commit Transaction
```

If any step fails, the transaction should be rolled back.

---

# 30. Error Handling

The application should return user-friendly error messages.

Examples:

```text
Phone number already exists.

Donation amount must be greater than zero.

Transfer proof is required.

Invalid file type.

File exceeds maximum size.
```

Never expose database or server errors directly to users.

---

# 31. Future Database Expansion

The current schema is intentionally minimal.

Future enhancements may include:

- Multiple orphanage branches
- Donation categories
- Financial accounting
- Expense management
- Monthly financial reports
- Email notifications
- SMS notifications
- WhatsApp Business API
- Digital signatures
- QR code verification
- Export to Excel
- Export to PDF reports
- Role permissions
- Activity dashboard

The existing schema should support these additions without major restructuring.

---

# 32. Development Best Practices

Developers should follow these principles:

- Keep business logic in Server Actions.
- Keep components focused on presentation.
- Validate all inputs.
- Avoid duplicated code.
- Use Prisma for all database access.
- Use Supabase Storage for uploaded files.
- Keep database schema normalized.
- Prefer composition over duplication.

---

# 33. Database Summary

The HasyDonate database is designed to be:

- Simple
- Secure
- Scalable
- Maintainable
- Auditable
- Production-ready

Core principles include:

- One Donatur can have many Donations.
- Every Donation belongs to one Donatur.
- Every Donation can generate one Kwitansi.
- Transfer proof is required only for Bank Transfer donations.
- Uploaded files are stored in Supabase Storage.
- Audit logs record important system activities.
- Settings centralize application configuration.
- Donation data is the single source of truth.

This design balances simplicity for current requirements with flexibility for future growth while remaining easy to understand and maintain.