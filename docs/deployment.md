# Deployment Guide

> HasyDonate Deployment Documentation

Version: 1.0

---

# 1. Overview

HasyDonate is deployed using a modern serverless architecture.

The application consists of:

- Next.js Application
- Supabase
- Vercel
- GitHub

Deployment should be automatic through GitHub.

---

# 2. Production Architecture

```
                Developer
                     │
                     ▼
                 GitHub Repository
                     │
              Automatic Deployment
                     │
                     ▼
                  Vercel
                     │
     ┌───────────────┴───────────────┐
     │                               │
     ▼                               ▼
Next.js Application           Server Actions
     │
     ▼
 Prisma ORM
     │
     ▼
Supabase PostgreSQL
     │
 ┌───┴────────────┐
 ▼                ▼
Database      Storage
```

---

# 3. Technology

| Service | Platform |
|----------|----------|
| Frontend | Next.js 15 |
| Backend | Next.js Server Actions |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| ORM | Prisma |
| Deployment | Vercel |
| Version Control | GitHub |

---

# 4. Prerequisites

Install:

- Node.js 22 LTS
- pnpm
- Git
- Supabase CLI (optional)
- Prisma CLI

Accounts required:

- GitHub
- Vercel
- Supabase

---

# 5. Clone Repository

```bash
git clone <repository-url>

cd hasydonate
```

---

# 6. Install Dependencies

```bash
pnpm install
```

---

# 7. Environment Variables

Create

```text
.env.local
```

Example

```env
DATABASE_URL="postgresql://..."

DIRECT_URL="postgresql://..."

NEXT_PUBLIC_SUPABASE_URL="https://..."

NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

SUPABASE_SERVICE_ROLE_KEY="..."

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Never commit this file.

---

# 8. Local Development

Start development

```bash
pnpm dev
```

Open

```
http://localhost:3000
```

---

# 9. Prisma

Generate Client

```bash
pnpm prisma generate
```

Create Migration

```bash
pnpm prisma migrate dev
```

Deploy Migration

```bash
pnpm prisma migrate deploy
```

Open Prisma Studio

```bash
pnpm prisma studio
```

---

# 10. Supabase Setup

Create project

↓

Enable Authentication

↓

Create Storage Bucket

↓

Run Prisma Migration

↓

Configure Environment Variables

---

## Storage Buckets

1. **transfer-proofs**:
   - Visibility: Private
   - Purpose: Stores bank transfer proofs uploaded by admins.
   - Access: Read/write only via authenticated admins/service role (signed URLs for viewing).

2. **foundation-assets**:
   - Visibility: Public (or Private with signed URL access, depending on Supabase settings. Public read allows easy rendering of the foundation logo).
   - Purpose: Stores branding assets such as the foundation logo.
   - Access: Write restricted to ADMIN users.

---

# 11. Authentication & Admin Creation

Enable Email Authentication in Supabase dashboard.

Disable anonymous access and public signup.

### Creating the First Administrator Account

Since public sign-ups are disabled, run the administrative script in the workspace to create the first `ADMIN` user:

```bash
npx tsx scripts/create-admin.ts <email> <password> <fullName>
```

Example:

```bash
npx tsx scripts/create-admin.ts admin@alhasyimi.or.id SecurePassword123 "Kepala Yayasan"
```

Subsequent users (Administrators or Front Admins) can be created directly by logging in as the administrator and using the User Management module in the dashboard.

Supported roles:

```text
ADMIN

FRONT_ADMIN
```

---

# 12. Build

Production build

```bash
pnpm build
```

---

Production start

```bash
pnpm start
```

---

# 13. Vercel Deployment

Import GitHub Repository.

Framework

```
Next.js
```

Root directory

```
/
```

Build command

```bash
pnpm build
```

Install command

```bash
pnpm install
```

Output

```
.next
```

---

# 14. Environment Variables (Production)

Configure inside Vercel.

Required

```
DATABASE_URL

DIRECT_URL

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

NEXT_PUBLIC_APP_URL
```

Never expose:

```
SUPABASE_SERVICE_ROLE_KEY

DATABASE_URL

DIRECT_URL
```

to Client Components (ensure they do not have the `NEXT_PUBLIC_` prefix).

---

# 15. Git Workflow

Main branches

```text
main

develop
```

Feature branches

```text
feature/donation

feature/dashboard

feature/report

feature/settings
```

Bug fixes

```text
fix/login

fix/receipt

fix/print
```

---

# 16. Deployment Workflow

```
Developer

↓

Feature Branch

↓

Pull Request

↓

Review

↓

Merge

↓

GitHub

↓

Automatic Deploy

↓

Vercel

↓

Production
```

---

# 17. Database Migration Workflow

```
Update Prisma Schema

↓

Generate Migration

↓

Review SQL

↓

Commit

↓

Deploy

↓

Run Migration
```

Never modify production database manually.

---

# 18. Backup Strategy

Supabase Database

Daily Backup

---

Supabase Storage

Weekly Backup

---

Configuration

Monthly Export

---

Keep at least

```text
30 Days
```

of backups.

---

# 19. Monitoring

Monitor

Application Status

Deployment Logs

Database Usage

Storage Usage

Authentication

Server Actions

---

Recommended tools

- Vercel Dashboard
- Supabase Dashboard

---

# 20. Logging

Application logs

Deployment logs

Authentication logs

Audit logs

Storage errors

Database errors

Never log:

- Passwords
- Service Role Keys
- Access Tokens

---

# 21. Performance

Enable

Image Optimization

Server Components

Static Assets

Compression

Caching

Avoid

Large Client Components

Duplicate Queries

Unnecessary API Routes

---

# 22. Security

Always

Use HTTPS

Enable RLS

Validate Input

Use Zod

Use Server Actions

Sanitize Data

Use Environment Variables

Never

Expose Secrets

Store Files Publicly

Trust Client Input

---

# 23. Disaster Recovery

If deployment fails

Rollback through Vercel.

If database fails

Restore latest backup.

If storage fails

Restore Storage Backup.

Always verify application functionality after recovery.

---

# 24. Production Checklist

Before every deployment

- All tests pass
- Build successful
- Environment variables configured
- Database migrations reviewed
- Storage bucket configured
- Authentication working
- RLS enabled
- No console errors
- No TypeScript errors
- No ESLint errors

---

# 25. Maintenance

Regular tasks

Weekly

- Review deployment logs
- Check storage usage
- Verify backups

Monthly

- Update dependencies
- Review security advisories
- Clean unused Storage files
- Optimize database indexes

---

# 26. Scalability

The deployment architecture supports future expansion.

Possible future enhancements

- Multiple orphanage branches
- CDN
- Custom domain
- Redis caching
- Background jobs
- Scheduled reports
- Email service
- WhatsApp Business API
- Monitoring dashboard

---

# 27. Deployment Summary

HasyDonate is deployed using a fully managed cloud architecture.

Core technologies

- Next.js
- Vercel
- Supabase
- Prisma

The deployment process prioritizes

- Simplicity
- Security
- Reliability
- Scalability
- Maintainability

Automatic deployments ensure every approved change can be delivered quickly while maintaining a stable production environment.