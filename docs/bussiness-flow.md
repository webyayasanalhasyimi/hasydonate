# Business Flow

> HasyDonate Business Flow Documentation

Version: 1.0

---

# 1. Introduction

This document describes the business processes implemented in HasyDonate.

The objective is to ensure every donation transaction follows a standardized workflow that is:

- Fast
- Accurate
- Traceable
- Easy to use
- Easy to audit

The application is designed for internal staff of Yayasan Panti Asuhan Al-Hasyimi.

---

# 2. User Roles

## Front Admin

Responsible for:

- Registering Donatur
- Recording donations
- Uploading transfer proof
- Generating Kwitansi
- Printing Kwitansi
- Sharing Kwitansi via WhatsApp

---

## Administrator

Responsible for:

- Managing users
- Managing Donatur
- Managing donations
- Viewing reports
- Updating application settings

---

# 3. High Level Workflow

```text
Login

↓

Dashboard

↓

Create Donation

↓

Generate Kwitansi

↓

Print / Share WhatsApp

↓

Dashboard
```

---

# 4. Authentication Flow

```text
Open Website

↓

Login

↓

Credentials Valid?
      │
 ┌────┴─────┐
 │          │
No         Yes
 │          │
 ▼          ▼
Error   Dashboard
```

Only authenticated users can access the application.

---

# 5. Dashboard Flow

Dashboard displays:

- Today's donations
- Monthly donations
- Total Donatur
- Donation statistics
- Recent transactions

From the dashboard users can navigate to:

- Donatur
- Donations
- Reports
- Settings

---

# 6. New Donation Flow

This is the primary workflow of HasyDonate.

```text
Dashboard

↓

New Donation

↓

Search Donatur

↓

Donatur Found?
```

---

## Existing Donatur

```text
Select Donatur

↓

Input Donation
```

---

## New Donatur

```text
Register Donatur

↓

Save Donatur

↓

Continue Donation
```

---

# 7. Donation Entry Flow

After selecting a Donatur.

```text
Donation Type

↓

Payment Method

↓

Donation Amount

↓

Notes (Optional)

↓

Save
```

Donation Types

```text
Zakat

Shadaqah

Sumbangan Lain
```

Payment Methods

```text
Tunai

Transfer Bank
```

---

# 8. Cash Donation Flow

```text
Select Tunai

↓

Input Amount

↓

Save Donation

↓

Generate Kwitansi
```

No additional documents are required.

---

# 9. Bank Transfer Flow

```text
Select Transfer Bank

↓

Input Amount

↓

Upload Transfer Proof

↓

Save Donation

↓

Generate Kwitansi
```

Transfer proof is mandatory.

---

# 10. Transfer Proof Upload

Supported files

```text
JPG

JPEG

PNG

PDF
```

Maximum size

```text
10 MB
```

Validation:

- File required
- Valid type
- Maximum size

---

# 11. Generate Kwitansi

After a donation is successfully saved.

The system automatically generates:

- Donation Number
- Receipt Number
- PDF Preview

The user can:

- Download PDF
- Print
- Share WhatsApp

---

# 12. Print Flow

```text
Generate PDF

↓

Print Preview

↓

Select Printer

↓

Print A5
```

The print action is recorded in Audit Logs.

---

# 13. WhatsApp Flow

```text
Generate PDF

↓

Open WhatsApp

↓

Auto-filled Message

↓

Attach PDF

↓

Send
```

The PDF is attached manually by the user.

Future versions may support automatic sending through the WhatsApp Business API.

---

# 14. Donatur Management

Users can:

- Search
- View
- Edit

Only administrators can delete (soft delete).

Searching is performed by:

- Phone Number
- Full Name

---

# 15. Donation Management

Users can:

- Search donations
- View details
- Edit notes
- View transfer proof
- Reprint receipt

Donation history is never deleted.

---

# 16. Dashboard Reporting

Dashboard provides:

Today

- Total Donations
- Total Amount

Monthly

- Total Transactions
- Total Donatur

Charts

- Donation Type
- Payment Method

Recent Activity

- Latest Donations

---

# 17. Settings Flow

Administrator only.

Settings include:

- Foundation information
- Bank information
- Receipt footer
- WhatsApp template

Changes immediately affect future generated receipts.

---

# 18. Error Handling

Examples

Missing Donatur

```text
Donatur not found.
```

Transfer proof missing

```text
Transfer proof is required.
```

Invalid amount

```text
Donation amount must be greater than zero.
```

Unsupported file

```text
Unsupported file format.
```

---

# 19. Audit Flow

Important actions are automatically recorded.

Examples

- Login
- Logout
- Create Donatur
- Update Donatur
- Create Donation
- Print Receipt
- Upload Transfer Proof
- Update Settings

---

# 20. Future Business Flow

Future enhancements may include:

- WhatsApp Business API
- Email receipts
- Financial reports
- Expense management
- Multi-branch support
- Approval workflow
- Export to Excel
- Scheduled reports

---

# 21. Summary

The business process of HasyDonate is designed around one primary goal:

> Record every donation as quickly and accurately as possible while producing a professional receipt that can be printed or shared digitally.

The workflow emphasizes:

- Minimal clicks
- Fast donation entry
- Clear validation
- Complete audit trail
- Consistent user experience