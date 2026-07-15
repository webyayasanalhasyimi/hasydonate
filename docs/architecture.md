# HasyDonate Architecture

> Software Architecture Documentation

Version: 1.0

---

# 1. Introduction

HasyDonate is an internal Donation Management Information System developed for **Yayasan Panti Asuhan Al-Hasyimi**.

The system digitizes the entire donation recording process, replacing handwritten receipts with a modern, secure, and efficient web application.

The primary objective is to reduce administrative work while improving donation tracking, reporting, and receipt generation.

---

# 2. Goals

The system is designed with the following objectives:

- Fast donation entry
- Accurate donor records
- Digital receipt generation
- Printable A5 receipts
- WhatsApp receipt sharing
- Centralized donation history
- Secure internal access
- Modern dashboard
- Simple user experience

---

# 3. Scope

HasyDonate is **NOT** a public donation platform.

The application is intended only for internal staff.

External donors cannot access the application.

---

# 4. User Roles

## Front Admin

Responsibilities:

- Search donor
- Register donor
- Record donation
- Generate receipt
- Print receipt
- Share receipt via WhatsApp

---

## Administrator

Responsibilities:

- Everything Front Admin can do
- Manage users
- View reports
- Dashboard analytics
- Manage donors
- Manage donations
- System settings

---

# 5. System Architecture

```
                Browser
                    │
                    ▼
              Next.js 15
         (App Router + RSC)
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
 Server Actions          Route Handlers
        │
        ▼
      Prisma ORM
        │
        ▼
 Supabase PostgreSQL
        │
 ┌──────┴─────────────┐
 │                    │
 ▼                    ▼
Authentication     Database
                    │
                    ▼
                Storage
```

---

# 6. Technology Stack

| Layer | Technology |
|--------|------------|
| Framework | Next.js 15 |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Database | Supabase PostgreSQL |
| ORM | Prisma |
| Authentication | Supabase Auth |
| Validation | Zod |
| Forms | React Hook Form |
| Charts | Recharts |
| PDF | @react-pdf/renderer |
| Deployment | Vercel |

---

# 7. Design Principles

The application should always prioritize:

## Simplicity

The interface should be understandable by staff with minimal computer experience.

---

## Speed

Recording a donation should take less than **30 seconds**.

---

## Reliability

No donation data should be lost.

Validation must occur before saving.

---

## Maintainability

The codebase should remain easy to understand and extend.

Avoid unnecessary abstractions.

---

## Scalability

Although initially used by a single orphanage, the architecture should allow future expansion to:

- Multiple branches
- Multiple administrators
- More donation categories
- Financial reporting
- Audit logging

---

# 8. Feature Modules

The application is divided into several independent modules.

```
Authentication

Dashboard

Donor Management

Donation Management

Receipt Management

User Management

Reports

Settings
```

Each module should encapsulate its own:

- Components
- Server Actions
- Validation
- Database queries
- Business logic

---

# 9. Data Flow

The primary workflow is:

```
Donor Arrives
        │
        ▼
Search Existing Donor
        │
 ┌──────┴─────────┐
 │                │
Found         Not Found
 │                │
 │          Create Donor
 │                │
 └──────┬─────────┘
        ▼
Input Donation
        ▼
Validation
        ▼
Save Database
        ▼
Generate Receipt
        ▼
PDF Created
        ▼
Print
or
Share via WhatsApp
```

---

# 10. Authentication

Every user must authenticate before accessing the system.

Authentication is handled by **Supabase Auth**.

Roles determine accessible menus and actions.

Unauthenticated users cannot access any dashboard pages.

---

# 11. Project Structure

```
src/

app/

components/

features/

hooks/

lib/

server/

types/

constants/
```

Each feature should own its business logic.

Avoid placing unrelated logic inside shared folders.

---

# 12. Coding Philosophy

The project follows these principles:

- Server Components first
- Server Actions over REST APIs whenever possible
- Type-safe code
- Minimal client-side JavaScript
- Reusable UI components
- Responsive design
- Accessibility by default

---

# 13. Future Expansion

The architecture should support future modules without requiring major restructuring.

Possible future enhancements include:

- QRIS payment integration
- WhatsApp Business API
- Email notifications
- Export to Excel
- Financial accounting
- Audit logs
- Barcode or QR receipt verification
- Cloud backup
- Multi-branch management
- Role-based permissions
- Activity monitoring

---

# 14. Summary

HasyDonate is designed as a modern, scalable, and maintainable internal donation management system.

The architecture prioritizes:

- Simplicity
- Performance
- Security
- Maintainability
- Scalability

while delivering an efficient experience for administrative staff.