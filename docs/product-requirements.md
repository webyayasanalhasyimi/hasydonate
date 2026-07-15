# Product Requirements Document (PRD)

> HasyDonate Product Requirements Document

Version: 1.0

Author: Muhammad Ade Dzakwan

Status: Draft

Last Updated: July 2026

---

# 1. Product Overview

## Product Name

HasyDonate

## Product Type

Internal Web Information System

## Organization

Yayasan Panti Asuhan Al-Hasyimi

---

# 2. Background

Yayasan Panti Asuhan Al-Hasyimi currently records donations manually using paper receipts.

Although this process has worked for many years, it introduces several operational challenges, including:

- Manual writing takes time.
- Donor history is difficult to search.
- Receipts can be lost or damaged.
- Donation reports must be prepared manually.
- Bank transfer proof is stored separately.
- Administrative work increases as donation volume grows.

To address these issues, HasyDonate is developed as an internal web application that digitizes the entire donation management process while preserving the existing business workflow.

---

# 3. Problem Statement

The current donation management process is:

- Manual
- Time-consuming
- Difficult to search
- Difficult to report
- Difficult to audit
- Not centralized

This causes inefficiencies for administrative staff and increases the risk of human error.

---

# 4. Vision

To provide Yayasan Panti Asuhan Al-Hasyimi with a modern, reliable, and easy-to-use donation management system that simplifies administrative work while improving data accuracy and service quality.

---

# 5. Mission

HasyDonate aims to:

- Digitize donation management.
- Reduce administrative workload.
- Improve donation traceability.
- Generate professional receipts.
- Simplify reporting.
- Improve donor management.
- Support future organizational growth.

---

# 6. Objectives

Primary objectives:

- Record donations in less than 30 seconds.
- Eliminate handwritten receipts.
- Centralize donor information.
- Generate printable A5 receipts.
- Support WhatsApp receipt sharing.
- Improve donation reporting.
- Maintain complete audit history.

---

# 7. Success Metrics

The project is considered successful when:

- 100% of donations are recorded digitally.
- Receipt generation takes less than 3 seconds.
- Donation entry takes less than 30 seconds.
- Reports are generated instantly.
- Staff no longer rely on manual receipt books.
- Duplicate donor records are minimized.

---

# 8. Target Users

## Primary Users

Front Admin

Responsibilities:

- Register Donatur
- Record donations
- Upload transfer proof
- Generate receipts
- Print receipts
- Share receipts

---

Administrator

Responsibilities:

- Manage users
- View reports
- Configure application settings
- Manage donation records
- Manage donor records

---

# 9. User Personas

## Front Admin

Needs:

- Fast workflow
- Minimal typing
- Easy donor search
- Simple interface
- Reliable receipt generation

---

## Administrator

Needs:

- Reports
- Monitoring
- User management
- System configuration
- Audit history

---

# 10. Scope

## Included (Version 1)

Authentication

Dashboard

Donatur Management

Donation Management

Receipt Generation

PDF Download

Receipt Printing

WhatsApp Sharing

Reports

Settings

User Management

Transfer Proof Upload

Audit Logs

---

## Excluded (Version 1)

Online donations

Payment gateway

QRIS

WhatsApp Business API

Email notifications

SMS notifications

Accounting

Expense management

Inventory

Mobile application

Multi-branch

---

# 11. Functional Requirements

The system shall:

- Authenticate users.
- Manage Donatur information.
- Record donation transactions.
- Generate donation numbers.
- Generate printable receipts.
- Upload transfer proof.
- Download receipts as PDF.
- Print receipts.
- Share receipts via WhatsApp.
- Display dashboard statistics.
- Generate reports.
- Maintain audit logs.
- Store files securely.

---

# 12. Non-Functional Requirements

The application must be:

Reliable

Responsive

Secure

Accessible

Maintainable

Scalable

Type-safe

Mobile-friendly

---

Performance

Dashboard loads under 2 seconds.

Receipt generated under 3 seconds.

Search results under 300 milliseconds.

---

Security

Authentication required.

Authorization enforced.

RLS enabled.

Input validation required.

Private file storage.

HTTPS only.

---

# 13. Business Rules

Every donation belongs to one Donatur.

Every Donatur may have multiple donations.

Transfer proof is required only for bank transfers.

Donation history cannot be deleted.

Receipts are generated dynamically.

Only administrators can manage users.

Only administrators can access settings.

---

# 14. Donation Workflow

```
Login

↓

Dashboard

↓

Search Donatur

↓

Register Donatur (if necessary)

↓

Create Donation

↓

Upload Transfer Proof (if bank transfer)

↓

Generate Receipt

↓

Print / Download / Share
```

---

# 15. Technical Stack

Framework

Next.js 15

Language

TypeScript

Styling

Tailwind CSS

UI

shadcn/ui

Database

Supabase PostgreSQL

Authentication

Supabase Auth

ORM

Prisma

Storage

Supabase Storage

PDF

@react-pdf/renderer

Deployment

Vercel

Package Manager

pnpm

---

# 16. Constraints

The application:

- Must remain simple to use.
- Must work well on desktop.
- Must support A5 printing.
- Must not require technical knowledge from staff.
- Must not expose sensitive information.

---

# 17. Risks

Potential risks include:

- Internet connectivity issues.
- Incorrect donor data entry.
- Large file uploads.
- Browser print inconsistencies.
- User adoption challenges.

Mitigation strategies:

- Input validation.
- File size limits.
- Standardized receipt layout.
- Staff training.
- Regular backups.

---

# 18. Assumptions

- Users have internet access.
- Administrators understand the donation process.
- Foundation information changes infrequently.
- Only internal staff access the application.

---

# 19. Future Roadmap

## Version 1

Core donation management.

---

## Version 1.1

Excel export.

Receipt templates.

Better dashboard.

---

## Version 1.2

Email notifications.

Receipt history improvements.

Advanced reports.

---

## Version 2

WhatsApp Business API.

Multi-branch support.

Role & permission system.

Financial accounting.

Scheduled reports.

Background jobs.

---

# 20. Out of Scope

The following are intentionally excluded:

- Public donation website.
- Online payment processing.
- QRIS.
- Mobile app.
- Accounting software.
- Inventory management.
- Payroll.
- Volunteer management.

---

# 21. Definition of Done

The project is considered complete when:

- All planned features are implemented.
- Authentication works correctly.
- Donation workflow is fully functional.
- Receipt generation is accurate.
- Reports are available.
- Printing works on A5 paper.
- Documentation is complete.
- Tests pass.
- Production deployment is successful.

---

# 22. Project Principles

The HasyDonate project follows these principles:

1. Simplicity over complexity.
2. Fast data entry over excessive features.
3. Maintainability over clever code.
4. User experience first.
5. Security by default.
6. Scalability for future growth.
7. Consistent design and architecture.
8. Reliable data and auditability.

---

# 23. Summary

HasyDonate is a modern internal donation management system designed specifically for Yayasan Panti Asuhan Al-Hasyimi.

Its primary objective is to replace manual donation recording with a secure, efficient, and user-friendly digital workflow while preserving the organization's existing operational process.

The system emphasizes speed, simplicity, data integrity, and maintainability, providing a strong foundation for future enhancements as the organization grows.