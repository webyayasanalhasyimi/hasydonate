# Donation History

Version: 1.0

---

# Purpose

The Donation History page provides a centralized view of all donation transactions recorded in HasyDonate.

This page enables staff to:

- View donation history
- Search transactions
- Filter donations
- View transaction details
- Reprint receipts
- Download receipts
- Share receipts via WhatsApp
- View transfer proof
- Edit donation notes

This page serves as the primary transaction management interface.

---

# Route

/dashboard/donations

---

# Roles

| Role | Access |
|------|:------:|
| Front Admin | ✅ |
| Admin | ✅ |

---

# Page Layout

```
Header

↓

Page Title

↓

Filter Section

↓

Donation Table

↓

Pagination
```

---

# Components

DonationHistoryPage

├── Header

├── FilterBar

├── DonationTable

├── Pagination

├── DonationDetailDrawer

├── ReceiptDialog

├── TransferProofDialog

└── ConfirmationDialog

---

# Filter Bar

Filters should remain sticky while scrolling.

---

## Search

Search by

- Donation Number
- Donatur Name
- WhatsApp Number

Placeholder

```
Search donation...
```

---

## Date Range

Options

Today

Yesterday

Last 7 Days

Last 30 Days

Custom

---

## Donation Type

Options

All

Zakat

Shadaqah

Sumbangan Lain

---

## Payment Method

Options

All

Tunai

Transfer Bank

---

## Staff

Admin only

Filter by

- Front Admin
- Administrator

---

# Donation Table

Columns

| Column | Description |
|----------|------------|
| Donation Number | Unique transaction number |
| Date | Donation date |
| Donatur | Donatur name |
| Donation Type | Zakat / Shadaqah / Sumbangan Lain |
| Payment Method | Tunai / Transfer |
| Amount | Currency |
| Staff | Recorded by |
| Action | Available actions |

---

# Table Features

Sorting

Pagination

Responsive

Sticky Header

Row Hover

Column Visibility

Search Highlight

---

# Row Actions

Every row contains:

View Detail

Print Receipt

Download PDF

Share WhatsApp

View Transfer Proof

Edit Notes

---

# Donation Detail

Displayed inside a Drawer.

Sections

Donatur Information

Donation Information

Payment Information

Receipt Information

Audit Information

---

## Donatur Information

Name

Address

WhatsApp

Total Donations

---

## Donation Information

Donation Number

Donation Type

Amount

Notes

Donation Date

---

## Payment Information

Method

Transfer Proof

(if available)

---

## Receipt Information

Receipt Number

Generated Date

Last Printed

Print Count

---

## Audit Information

Created By

Created At

Updated At

---

# Transfer Proof

Only visible when

```
Payment Method

=

Transfer Bank
```

Display

Image Preview

Download Button

Open Original

---

# Receipt Actions

Print

↓

Browser Print

---

Download

↓

Generate PDF

↓

Download

---

Share WhatsApp

↓

Generate PDF

↓

Open WhatsApp

↓

Admin attaches PDF

---

# Edit Notes

Only

Notes

can be edited.

The following fields cannot be changed

Donation Number

Amount

Payment Method

Donation Date

Donatur

---

# Delete Donation

Only Administrator.

Deletion should require confirmation.

Recommended strategy

Soft Delete

or

Status

```
Cancelled
```

instead of permanent deletion.

---

# Pagination

Default

20 rows

Maximum

100 rows

---

# Loading States

Table Skeleton

Drawer Skeleton

PDF Loading

Transfer Proof Loading

---

# Empty State

```
No donations found.
```

Action

```
Create Donation
```

---

# Error States

Unable to load donations.

↓

Retry

---

Receipt generation failed.

↓

Retry

---

Transfer proof unavailable.

↓

Show Message

---

# Keyboard Shortcuts

Ctrl + F

Search

---

Ctrl + P

Print Receipt

---

Esc

Close Drawer

---

Enter

Open Detail

---

# Mobile Behavior

Desktop

Primary

Tablet

Supported

Mobile

Responsive table

Card Layout

---

# Accessibility

Keyboard Navigation

ARIA Labels

Focus Indicators

Screen Reader Support

---

# Server Actions

listDonations()

getDonation()

generateReceipt()

downloadReceipt()

shareReceipt()

updateDonationNotes()

cancelDonation()

---

# Database Operations

Read

donations

Read

donors

Read

audit_logs

Read

settings

Read

Supabase Storage

---

# Acceptance Criteria

✓ Fast search

✓ Accurate filtering

✓ Responsive table

✓ Receipt printable

✓ PDF downloadable

✓ WhatsApp sharing available

✓ Transfer proof accessible

✓ Notes editable

✓ Audit information visible

✓ Pagination performs well