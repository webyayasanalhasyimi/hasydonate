<!-- BEGIN:nextjs-agent-rules -->
# Next.js Agent Rules

This project uses the latest Next.js App Router.

This version may contain APIs that differ from the model's training data.

Before modifying framework-specific code:

- Read the relevant documentation inside `node_modules/next/dist/docs/`
- Prefer App Router over Pages Router
- Use React Server Components whenever possible
- Use Server Actions instead of API Routes when appropriate
- Do not introduce deprecated APIs
- Follow the latest Next.js conventions
<!-- END:nextjs-agent-rules -->



<!-- BEGIN:project-overview -->

# Project Overview

Project Name:

**HasyDonate**

HasyDonate is an internal web information system used by Yayasan Panti Asuhan Al-Hasyimi.

This system is **NOT** a public donation website.

Only internal staff are allowed to access the application.

The primary purpose is to simplify donation recording, receipt generation, and donation administration.

Main business flow:

1. Front Admin receives donation
2. Search existing donor OR create new donor
3. Input donation
4. Generate receipt (Nota/Kwitansi)
5. Export receipt as PDF
6. Share receipt via WhatsApp
7. Or print receipt directly
8. Donation stored in dashboard
9. Admin can view reports and history

Main modules:

- Authentication
- Dashboard
- Donor Management
- Donation Management
- Receipt Generator
- PDF Generator
- WhatsApp Sharing
- Reports
- User Management

System users:

- Front Admin
- Administrator

The system should prioritize:

- Fast input
- Minimal clicks
- POS-like experience
- Clean interface
- Mobile-friendly
- Printable documents

<!-- END:project-overview -->



<!-- BEGIN:programming-language-rules -->

# Programming Rules

Use:

- TypeScript only
- Strict mode
- Never use "any"
- Prefer interfaces over type aliases for objects
- Use enums only when necessary
- Prefer readonly whenever possible
- Avoid unnecessary abstraction

<!-- END:programming-language-rules -->



<!-- BEGIN:package-manager-rules -->

# Package Manager

Use pnpm only.

Never use:

- npm
- yarn
- bun

Commands:

pnpm install

pnpm add

pnpm remove

pnpm dev

pnpm build

pnpm lint

<!-- END:package-manager-rules -->



<!-- BEGIN:coding-style -->

# Coding Style

General principles:

- Simple over clever
- Readability first
- Small reusable components
- Consistent naming
- Avoid duplicated code

Naming:

Components:
PascalCase

Example:

DonationForm.tsx

Hooks:

useDonation.ts

Functions:

camelCase

Constants:

UPPER_SNAKE_CASE

Folders:

kebab-case

Examples:

donation-management

receipt-generator

Never use magic numbers.

Always extract constants.

<!-- END:coding-style -->



<!-- BEGIN:react-agent-rules -->

# React Rules

Prefer:

- Server Components
- Client Components only when necessary

Keep components small.

One responsibility per component.

Avoid prop drilling.

Use Context only for global state.

Avoid unnecessary useEffect.

Prefer derived state.

<!-- END:react-agent-rules -->



<!-- BEGIN:tailwind-agent-rules -->

# Tailwind Rules

Use Tailwind CSS only.

Requirements:

- Responsive
- Accessible
- Mobile first
- Dark mode ready
- Use utility classes
- Avoid inline styles
- Avoid custom CSS unless necessary

Design language:

- Clean
- Professional
- Modern admin dashboard
- Green color palette matching Yayasan Al-Hasyimi branding
- Rounded corners
- Soft shadows
- Spacious layout

<!-- END:tailwind-agent-rules -->



<!-- BEGIN:typescript-agent-rules -->

# TypeScript Rules

Always enable:

strict

noUncheckedIndexedAccess

exactOptionalPropertyTypes

Prefer explicit return types.

Never disable TypeScript errors.

<!-- END:typescript-agent-rules -->



<!-- BEGIN:tsup-agent-rules -->

This project does not use tsup.

Ignore tsup-related suggestions.

<!-- END:tsup-agent-rules -->



<!-- BEGIN:biome-agent-rules -->

If Biome is installed:

- Use Biome formatter
- Use Biome linting
- Do not introduce Prettier

<!-- END:biome-agent-rules -->



<!-- BEGIN:eslint-agent-rules -->

Use ESLint.

Fix warnings whenever possible.

Do not disable rules without explanation.

<!-- END:eslint-agent-rules -->



<!-- BEGIN:biome-eslint-agent-rules -->

If both ESLint and Biome exist:

- ESLint handles lint rules
- Biome handles formatting

Do not create conflicts.

<!-- END:biome-eslint-agent-rules -->



<!-- BEGIN:database-design -->

# Core Data Model

## Donor

Fields:

- id
- fullName
- address
- phoneNumber
- createdAt
- updatedAt

## Donation

Fields:

- id
- donorId
- donationNumber
- donationType
- amount
- notes
- donationDate
- receiptNumber
- createdBy
- createdAt

Donation Type:

- ZAKAT
- SHADAQAH
- SUMBANGAN_LAIN

Relationships:

One Donor

↓

Many Donations

Receipt is generated from Donation.

Never duplicate donor information inside Donation.

<!-- END:database-design -->



<!-- BEGIN:receipt-rules -->

# Receipt Rules

Receipt size:

A5 Portrait

Must closely match the official printed receipt provided by Yayasan Al-Hasyimi. :contentReference[oaicite:0]{index=0}

Receipt contains:

- Receipt Number
- Date
- Donor Name
- Address
- Phone
- Donation Type
- Donation Amount
- Admin Signature
- Yayasan Logo
- Thank You Message

Receipt can be:

- Downloaded as PDF
- Printed
- Shared via WhatsApp

<!-- END:receipt-rules -->



<!-- BEGIN:dashboard-rules -->

# Dashboard

Dashboard should display:

- Total Donations Today
- Total Donations This Month
- Total Donors
- Donation by Type
- Recent Donations
- Monthly Chart

<!-- END:dashboard-rules -->



<!-- BEGIN:ux-rules -->

# UX Rules

The front donation page should behave like a POS system.

Goals:

- Keyboard friendly
- Extremely fast data entry
- Search donor instantly
- Create donor without leaving page
- Auto-focus next input
- Minimize page navigation

Target:

A donation should be recorded in under 30 seconds.

<!-- END:ux-rules -->



<!-- BEGIN:future-features -->

Future features (do not implement unless requested):

- QRIS integration
- WhatsApp API automation
- Barcode receipt
- Financial reports
- Export Excel
- Backup system
- Role permissions
- Audit logs
- Email receipts
- Cloud storage

<!-- END:future-features -->