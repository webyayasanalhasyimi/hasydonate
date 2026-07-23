# Operational Runbooks - HasyDonate

This document contains step-by-step procedures for the deployment, backup, restore, recovery, and security maintenance of HasyDonate.

---

## Runbook 1: Initial Deployment

Use this runbook to deploy HasyDonate for the first time on Supabase and Vercel.

### Step 1: Set Up Supabase Project
1. Log in to [Supabase Console](https://supabase.com).
2. Click **New Project** and select your organization.
3. Set the project name to `HasyDonate` and generate a secure database password. Save this password.
4. Select the region closest to your users (e.g., Singapore/Southeast Asia).
5. Wait for the database instance to provision.

### Step 2: Configure Storage Buckets
1. Go to the **Storage** section in the Supabase Sidebar.
2. Click **New Bucket**.
3. Create a bucket named `transfer-proofs` and set its visibility to **Private**.
4. Create a second bucket named `foundation-assets` and set its visibility to **Public** (or **Private** depending on accessibility requirements. Public allows public logo retrieval).
5. In **Policies**, configure write access so that only authenticated users with administrative access can write files.

### Step 3: Run Database Migrations Locally
1. Clone the repository and install dependencies:
   ```bash
   pnpm install
   ```
2. Create a local `.env` file using `.env.example` as a template and populate the values:
   - `DATABASE_URL`: Transaction pooler connection string from Supabase (Settings -> Database -> Connection string -> URI, transaction pooling on port 5432 or 6543).
   - `DIRECT_URL`: Direct database connection string from Supabase (Session pooling / direct access on port 5432).
3. Run the migrations:
   ```bash
   pnpm prisma migrate deploy
   ```

### Step 4: Create the First ADMIN User
Create the root administrator account by executing:
```bash
npx tsx scripts/create-admin.ts <admin-email> <password> <fullName>
```

### Step 5: Deploy to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project** and select your Git repository.
3. Configure the Build Settings:
   - Framework: **Next.js**
   - Build Command: `pnpm build`
   - Install Command: `pnpm install`
4. Add the following **Environment Variables**:
   - `DATABASE_URL` (Supabase database URL)
   - `DIRECT_URL` (Supabase direct connection URL)
   - `NEXT_PUBLIC_SUPABASE_URL` (Supabase API URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase client/anon API key)
   - `SUPABASE_SERVICE_ROLE_KEY` (Supabase service role/admin API key)
   - `NEXT_PUBLIC_APP_URL` (Your Vercel deployment URL, e.g. `https://hasydonate.vercel.app`)
5. Click **Deploy**.

---

## Runbook 2: Routine Deployment (Updates)

Follow this process to deploy updates to the production system.

1. Ensure the code changes have been merged into `main` and verified locally.
2. If there are new database migrations:
   - Run `pnpm prisma migrate deploy` locally pointing to the production database (or configure a pre-deploy build hook in Vercel to run migrations).
3. Vercel automatically deploys commits pushed to the `main` branch.
4. Verify deployment logs in the Vercel dashboard.

---

## Runbook 3: Rollback Procedure

If a production update introduces critical bugs, follow these steps to roll back.

### Code Rollback
1. Open the **Vercel Dashboard** for the project.
2. Go to **Deployments**.
3. Locate the last known good deployment.
4. Click the three dots (options) next to it and select **Promote to Production**. This instantly shifts traffic to the older build without rebuilding.

### Database Rollback
If the schema changed and is incompatible with the older build, you must run a database rollback:
1. Revert the database schema changes using your Prisma migration rollback script, or restore the database backup taken before the deployment (see Runbook 4 & 5).

---

## Runbook 4: Database Backup

Supabase automatically takes daily backups. For manual or pre-deployment backups:

1. Install `pg_dump` on your system.
2. Run the following command:
   ```bash
   pg_dump -h <db-host> -U postgres -d postgres -F c -b -v -f hasydonate_backup_$(date +%F).dump
   ```
   *Note: Get `<db-host>` from Supabase Database settings.*

---

## Runbook 5: Database Restore

To restore the database from a `.dump` backup file:

1. **WARNING:** This will overwrite current database data. Put the app in maintenance mode first (e.g. block traffic on Vercel).
2. Restore schema and data:
   ```bash
   pg_restore -h <db-host> -U postgres -d postgres -v --clean --no-acl --no-owner hasydonate_backup_XXXX-XX-XX.dump
   ```

---

## Runbook 6: Storage Recovery

To back up and restore storage bucket assets:

### Backup Storage Assets
Use the Supabase CLI to pull bucket objects locally:
```bash
supabase storage copy -r ss:///transfer-proofs local://backup/transfer-proofs
supabase storage copy -r ss:///foundation-assets local://backup/foundation-assets
```

### Restore Storage Assets
To restore from local backup:
```bash
supabase storage copy -r local://backup/transfer-proofs ss:///transfer-proofs
supabase storage copy -r local://backup/foundation-assets ss:///foundation-assets
```

---

## Runbook 7: Secret Rotation

If Supabase keys or database passwords are leaked, rotate them immediately:

1. **Database Password**:
   - Go to Supabase -> Settings -> Database -> Database Password -> Reset Database Password.
   - Update `DATABASE_URL` and `DIRECT_URL` in Vercel settings and redeploy.
2. **Supabase API Keys (Anon / Service Role)**:
   - Go to Supabase -> Settings -> API -> JWT Settings -> Generate New JWT Secret. (This will invalidate current keys).
   - Copy the new `anon` and `service_role` keys.
   - Update Vercel environment variables with the new keys.
   - Redeploy the application.

---

## Runbook 8: Incident Response Checklist

In the event of system downtime or data errors:

- [ ] Check Vercel status page and deployment logs.
- [ ] Check Supabase status page and database connection counts.
- [ ] Enable maintenance page on Vercel if the system is unusable.
- [ ] If data corruption occurred, perform point-in-time recovery (PITR) or restore from the latest daily backup.
- [ ] Review structured logs in Vercel/Supabase to locate stack traces and error codes.
