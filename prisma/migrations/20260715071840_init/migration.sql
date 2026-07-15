-- CreateEnum
CREATE TYPE "role" AS ENUM ('ADMIN', 'FRONT_ADMIN');

-- CreateEnum
CREATE TYPE "donation_type" AS ENUM ('ZAKAT', 'SHADAQAH', 'SUMBANGAN_LAIN');

-- CreateEnum
CREATE TYPE "payment_method" AS ENUM ('CASH', 'BANK_TRANSFER');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" "role" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donors" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "address" TEXT NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "donors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" UUID NOT NULL,
    "donation_number" VARCHAR(30) NOT NULL,
    "donor_id" UUID NOT NULL,
    "donation_type" "donation_type" NOT NULL,
    "payment_method" "payment_method" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "notes" TEXT,
    "transfer_proof_path" TEXT,
    "transfer_proof_filename" VARCHAR(255),
    "transfer_uploaded_at" TIMESTAMPTZ,
    "donation_date" TIMESTAMPTZ NOT NULL,
    "received_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "table_name" VARCHAR(50) NOT NULL,
    "record_id" UUID NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "key" VARCHAR(100) NOT NULL,
    "value" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "donors_phone_number_key" ON "donors"("phone_number");

-- CreateIndex
CREATE INDEX "donors_phone_number_idx" ON "donors"("phone_number");

-- CreateIndex
CREATE INDEX "donors_full_name_idx" ON "donors"("full_name");

-- CreateIndex
CREATE UNIQUE INDEX "donations_donation_number_key" ON "donations"("donation_number");

-- CreateIndex
CREATE INDEX "donations_donation_number_idx" ON "donations"("donation_number");

-- CreateIndex
CREATE INDEX "donations_donation_date_idx" ON "donations"("donation_date");

-- CreateIndex
CREATE INDEX "donations_donor_id_idx" ON "donations"("donor_id");

-- CreateIndex
CREATE INDEX "donations_received_by_idx" ON "donations"("received_by");

-- CreateIndex
CREATE INDEX "donations_donation_type_idx" ON "donations"("donation_type");

-- CreateIndex
CREATE INDEX "donations_payment_method_idx" ON "donations"("payment_method");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_donor_id_fkey" FOREIGN KEY ("donor_id") REFERENCES "donors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_received_by_fkey" FOREIGN KEY ("received_by") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
