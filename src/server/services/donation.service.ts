import { prisma } from "@/lib/prisma/client";
import { type Donor, type Profile, type Donation, type DonationType, type PaymentMethod, Prisma } from "@prisma/client";
import { generateDonationNumber } from "@/features/donation/lib/donation-number";
import {
  type DonationCreateDto,
  type DonationDetailDto,
  type DonationListItemDto,
  type DonationSummaryDto,
} from "@/features/donation/types";

interface DonationWithRelations extends Donation {
  readonly donor: Donor;
  readonly receiver: Profile;
}

function mapToDetailDto(donation: DonationWithRelations): DonationDetailDto {
  return {
    id: donation.id,
    donationNumber: donation.donationNumber,
    donorId: donation.donorId,
    donorName: donation.donor.fullName,
    donorPhone: donation.donor.phoneNumber,
    donorAddress: donation.donor.address,
    donationType: donation.donationType,
    paymentMethod: donation.paymentMethod,
    amount: Number(donation.amount),
    notes: donation.notes,
    transferProofPath: donation.transferProofPath,
    transferProofFilename: donation.transferProofFilename,
    donationDate: donation.donationDate,
    receivedByName: donation.receiver.fullName,
    createdAt: donation.createdAt,
  };
}

function mapToListItemDto(donation: DonationWithRelations): DonationListItemDto {
  return {
    id: donation.id,
    donationNumber: donation.donationNumber,
    donorName: donation.donor.fullName,
    donationType: donation.donationType,
    paymentMethod: donation.paymentMethod,
    amount: Number(donation.amount),
    donationDate: donation.donationDate,
    receivedByName: donation.receiver.fullName,
  };
}

export const DonationService = {
  async findById(id: string): Promise<DonationDetailDto | null> {
    const donation = await prisma.donation.findUnique({
      where: { id },
      include: {
        donor: true,
        receiver: true,
      },
    });
    if (!donation) return null;
    return mapToDetailDto(donation);
  },

  async getByDonationNumber(donationNumber: string): Promise<DonationDetailDto | null> {
    const donation = await prisma.donation.findUnique({
      where: { donationNumber },
      include: {
        donor: true,
        receiver: true,
      },
    });
    if (!donation) return null;
    return mapToDetailDto(donation);
  },

  async create(data: DonationCreateDto, userId: string): Promise<DonationDetailDto> {
    return prisma.$transaction(async (tx) => {
      // 1. Verify Donor exists
      const donor = await tx.donor.findFirst({
        where: { id: data.donorId, deletedAt: null },
      });
      if (!donor) {
        throw new Error("Donatur tidak ditemukan atau telah dihapus");
      }

      // 2. Generate next sequential number transactionally
      const donationNumber = await generateDonationNumber(tx, data.donationDate);

      // 3. Write Donation
      const amountDecimal = new Prisma.Decimal(data.amount);
      const donation = await tx.donation.create({
        data: {
          donationNumber,
          donorId: data.donorId,
          donationType: data.donationType,
          paymentMethod: data.paymentMethod,
          amount: amountDecimal,
          notes: data.notes || null,
          transferProofPath: data.transferProofPath || null,
          transferProofFilename: data.transferProofFilename || null,
          transferUploadedAt: data.transferProofPath ? new Date() : null,
          donationDate: data.donationDate,
          receivedBy: userId,
        },
        include: {
          donor: true,
          receiver: true,
        },
      });

      // 4. Create Audit Log for creation
      await tx.auditLog.create({
        data: {
          userId,
          action: "CREATE_DONATION",
          tableName: "donations",
          recordId: donation.id,
          oldValue: Prisma.DbNull,
          newValue: donation as unknown as Prisma.InputJsonValue,
        },
      });

      // 5. Create Audit Log for transfer proof if uploaded
      if (donation.transferProofPath) {
        await tx.auditLog.create({
          data: {
            userId,
            action: "UPLOAD_TRANSFER_PROOF",
            tableName: "donations",
            recordId: donation.id,
            oldValue: Prisma.DbNull,
            newValue: {
              transferProofPath: donation.transferProofPath,
              transferProofFilename: donation.transferProofFilename,
            } as unknown as Prisma.InputJsonValue,
          },
        });
      }

      return mapToDetailDto(donation);
    });
  },

  async paginate(options: {
    readonly cursor?: string | undefined;
    readonly limit: number;
    readonly query?: string | undefined;
  }): Promise<{ readonly items: readonly DonationListItemDto[]; readonly nextCursor?: string | undefined }> {
    const limit = options.limit;
    const cursor = options.cursor;
    const query = options.query;

    const where: Prisma.DonationWhereInput = {
      donor: { deletedAt: null },
      ...(query
        ? {
            OR: [
              { donationNumber: { contains: query, mode: "insensitive" } },
              { donor: { fullName: { contains: query, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    const donations = await prisma.donation.findMany({
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      where,
      orderBy: { donationDate: "desc" },
      include: {
        donor: true,
        receiver: true,
      },
    });

    let nextCursor: string | undefined = undefined;
    if (donations.length > limit) {
      const nextItem = donations.pop();
      nextCursor = nextItem?.id;
    }

    return {
      items: donations.map(mapToListItemDto),
      nextCursor,
    };
  },

  async search(
    query: string,
    options: { readonly cursor?: string | undefined; readonly limit: number }
  ): Promise<{ readonly items: readonly DonationListItemDto[]; readonly nextCursor?: string | undefined }> {
    return this.paginate({
      query,
      cursor: options.cursor,
      limit: options.limit,
    });
  },

  async getTodaySummary(): Promise<DonationSummaryDto> {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parts = formatter.formatToParts(new Date());
    const year = parts.find((p) => p.type === "year")?.value || "";
    const month = parts.find((p) => p.type === "month")?.value || "";
    const day = parts.find((p) => p.type === "day")?.value || "";

    const startOfDay = new Date(`${year}-${month}-${day}T00:00:00+07:00`);
    const endOfDay = new Date(`${year}-${month}-${day}T23:59:59.999+07:00`);

    const result = await prisma.donation.aggregate({
      _sum: { amount: true },
      _count: { id: true },
      where: {
        donationDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        donor: { deletedAt: null },
      },
    });

    return {
      totalAmount: result._sum.amount ? Number(result._sum.amount) : 0,
      transactionCount: result._count.id || 0,
    };
  },

  async getMonthlySummary(): Promise<DonationSummaryDto> {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
    });
    const parts = formatter.formatToParts(new Date());
    const year = parts.find((p) => p.type === "year")?.value || "";
    const month = parts.find((p) => p.type === "month")?.value || "";

    const startOfMonth = new Date(`${year}-${month}-01T00:00:00+07:00`);
    const lastDay = new Date(parseInt(year, 10), parseInt(month, 10), 0).getDate();
    const endOfMonth = new Date(`${year}-${month}-${String(lastDay).padStart(2, "0")}T23:59:59.999+07:00`);

    const result = await prisma.donation.aggregate({
      _sum: { amount: true },
      _count: { id: true },
      where: {
        donationDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        donor: { deletedAt: null },
      },
    });

    return {
      totalAmount: result._sum.amount ? Number(result._sum.amount) : 0,
      transactionCount: result._count.id || 0,
    };
  },

  async getDonationTypeSummary(): Promise<Record<DonationType, number>> {
    const groups = await prisma.donation.groupBy({
      by: ["donationType"],
      _sum: { amount: true },
      where: { donor: { deletedAt: null } },
    });

    const summary: Record<DonationType, number> = {
      ZAKAT: 0,
      SHADAQAH: 0,
      SUMBANGAN_LAIN: 0,
    };

    for (const group of groups) {
      summary[group.donationType] = group._sum.amount ? Number(group._sum.amount) : 0;
    }

    return summary;
  },

  async getPaymentMethodSummary(): Promise<Record<PaymentMethod, number>> {
    const groups = await prisma.donation.groupBy({
      by: ["paymentMethod"],
      _sum: { amount: true },
      where: { donor: { deletedAt: null } },
    });

    const summary: Record<PaymentMethod, number> = {
      CASH: 0,
      BANK_TRANSFER: 0,
    };

    for (const group of groups) {
      summary[group.paymentMethod] = group._sum.amount ? Number(group._sum.amount) : 0;
    }

    return summary;
  },

  async getRecentDonations(limit: number): Promise<readonly DonationListItemDto[]> {
    const donations = await prisma.donation.findMany({
      take: limit,
      where: { donor: { deletedAt: null } },
      orderBy: { donationDate: "desc" },
      include: {
        donor: true,
        receiver: true,
      },
    });

    return donations.map(mapToListItemDto);
  },

  async validateTransferProof(id: string): Promise<boolean> {
    const donation = await prisma.donation.findUnique({
      where: { id },
      select: { transferProofPath: true, paymentMethod: true },
    });
    if (!donation) return false;
    if (donation.paymentMethod !== "BANK_TRANSFER") return true;
    return !!donation.transferProofPath;
  },
};
export type DonationServiceType = typeof DonationService;
