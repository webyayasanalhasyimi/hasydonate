# HasyDonate

> Internal Donation Management Information System for Yayasan Panti Asuhan Al-Hasyimi

<p align="center">
  <img src="./public/logo.png" alt="HasyDonate Logo" width="180">
</p>

<p align="center">
  Fast • Modern • POS-like • Paperless
</p>

---

## Overview

HasyDonate is an internal web-based information system designed for **Yayasan Panti Asuhan Al-Hasyimi** to simplify donation management, receipt generation, and reporting.

Unlike public donation platforms, HasyDonate is intended exclusively for **internal staff**.

The application focuses on speed, simplicity, and accuracy during donation recording while providing professional PDF receipts that can be printed or shared via WhatsApp.

---

## Features

### Authentication

- Secure login
- Role-based access
- Admin management

### Dashboard

- Total donations today
- Total donations this month
- Total donors
- Donation statistics
- Recent transactions

### Donor Management

- Create donor
- Edit donor
- Search donor instantly
- Donation history

### Donation Management

Supported donation types:

- Zakat
- Shadaqah
- Sumbangan Lain

### Receipt Generator

Generate official A5 receipts.

Features:

- Printable PDF
- Download PDF
- Share via WhatsApp
- Reprint anytime

### POS-like Donation Entry

Designed for front office staff.

Workflow:

```text
Search Donor
      ↓
Create Donor (if needed)
      ↓
Input Donation
      ↓
Save
      ↓
Generate Receipt
      ↓
Print or Share via WhatsApp
```

---

# Technology Stack

| Category | Technology |
|-----------|------------|
| Framework | Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| ORM | Prisma |
| Validation | Zod |
| Forms | React Hook Form |
| Tables | TanStack Table |
| Charts | Recharts |
| PDF Generator | @react-pdf/renderer |
| Deployment | Vercel |
| Package Manager | pnpm |

---

# Architecture

```text
                 GitHub
                    │
                    ▼
                Vercel Deployment
                    │
      ┌─────────────┴─────────────┐
      │                           │
      ▼                           ▼
 Next.js App Router         Server Actions
      │
      ▼
 Prisma ORM
      │
      ▼
 Supabase PostgreSQL
      │
      ├── Database
      ├── Authentication
      └── Storage
```

---

# Project Structure

```text
src/
├── app/
│   ├── (auth)
│   ├── (dashboard)
│   ├── api
│   └── receipts
│
├── components/
│
├── features/
│
├── hooks/
│
├── lib/
│
├── server/
│
├── types/
│
└── constants/
```

---

# Database Design

## Donors

| Field | Type |
|-------|------|
| id | UUID |
| full_name | String |
| address | Text |
| phone_number | String |
| created_at | Timestamp |
| updated_at | Timestamp |

---

## Donations

| Field | Type |
|-------|------|
| id | UUID |
| donor_id | UUID |
| donation_number | String |
| donation_type | Enum |
| amount | Decimal |
| notes | Text |
| donation_date | Timestamp |
| receipt_number | String |
| created_by | UUID |
| created_at | Timestamp |

Donation Types

- Zakat
- Shadaqah
- Sumbangan Lain

---

# User Roles

## Front Admin

- Search donor
- Add donor
- Record donation
- Generate receipt
- Print receipt
- Share receipt via WhatsApp

## Administrator

Everything from Front Admin plus:

- Dashboard
- Reports
- User management
- Donation management
- Donor management

---

# Receipt Flow

```text
Input Donation
      │
      ▼
Validate Data
      │
      ▼
Save Donation
      │
      ▼
Generate PDF
      │
      ├───────────────┐
      ▼               ▼
Download PDF      Print A5
      │
      ▼
Share via WhatsApp
```

---

# Development

Install dependencies

```bash
pnpm install
```

Start development server

```bash
pnpm dev
```

Build production

```bash
pnpm build
```

Lint

```bash
pnpm lint
```

---

# Environment Variables

Create a `.env.local` file.

```env
DATABASE_URL=

DIRECT_URL=

NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

NEXTAUTH_SECRET=

NEXTAUTH_URL=
```

---

# Future Features

- QRIS integration
- WhatsApp Business API
- Email receipts
- Export Excel
- Financial reports
- Audit logs
- Activity logs
- Multi-branch support
- Barcode / QR receipt verification
- Backup & restore
- Notification system

---

# Design Principles

The application should always prioritize:

- Fast data entry
- Minimal clicks
- Keyboard-friendly navigation
- Mobile responsive
- Clean and modern interface
- Accessibility
- High performance
- Simple and maintainable code

---

# License

This project is developed exclusively for **Yayasan Panti Asuhan Al-Hasyimi**.

All rights reserved.