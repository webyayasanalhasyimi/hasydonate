import { prisma } from "@/lib/prisma/client";
import { type Donor, Prisma } from "@prisma/client";
import {
  type DonaturListItemDto,
  type DonaturDetailDto,
} from "@/features/donatur/types";
import { type CreateDonorInput } from "@/features/donatur/schemas/create-donatur.schema";
import { type UpdateDonorInput } from "@/features/donatur/schemas/update-donatur.schema";

export const DonorService = {
  getById(id: string): Promise<Donor | null> {
    return prisma.donor.findFirst({
      where: { id, deletedAt: null },
    });
  },

  async findById(id: string): Promise<DonaturDetailDto | null> {
    const donor = await prisma.donor.findFirst({
      where: { id, deletedAt: null },
      include: {
        donations: {
          orderBy: { donationDate: "desc" },
        },
      },
    });

    if (!donor) return null;

    const total = donor.donations.reduce((sum, d) => sum + Number(d.amount), 0);
    const lastDonation = donor.donations[0] ? donor.donations[0].donationDate : null;

    return {
      id: donor.id,
      fullName: donor.fullName,
      address: donor.address,
      phoneNumber: donor.phoneNumber,
      totalDonations: total,
      lastDonationAt: lastDonation,
      createdAt: donor.createdAt,
      updatedAt: donor.updatedAt,
      donations: donor.donations.map((d) => ({
        id: d.id,
        donationNumber: d.donationNumber,
        donationType: d.donationType,
        amount: Number(d.amount),
        donationDate: d.donationDate,
        paymentMethod: d.paymentMethod,
      })),
    };
  },

  findByPhone(phoneNumber: string): Promise<Donor | null> {
    return prisma.donor.findFirst({
      where: { phoneNumber, deletedAt: null },
    });
  },

  async create(data: CreateDonorInput, userId: string): Promise<Donor> {
    return prisma.$transaction(async (tx) => {
      const newDonor = await tx.donor.create({ data });
      await tx.auditLog.create({
        data: {
          userId,
          action: "CREATE_DONATUR",
          tableName: "donors",
          recordId: newDonor.id,
          oldValue: Prisma.DbNull,
          newValue: newDonor as unknown as Prisma.InputJsonValue,
        },
      });
      return newDonor;
    });
  },

  async update(id: string, data: UpdateDonorInput, userId: string): Promise<Donor> {
    return prisma.$transaction(async (tx) => {
      const oldDonor = await tx.donor.findFirst({
        where: { id, deletedAt: null },
      });
      if (!oldDonor) throw new Error("Donatur tidak ditemukan");

      const newDonor = await tx.donor.update({
        where: { id },
        data,
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: "UPDATE_DONATUR",
          tableName: "donors",
          recordId: newDonor.id,
          oldValue: oldDonor as unknown as Prisma.InputJsonValue,
          newValue: newDonor as unknown as Prisma.InputJsonValue,
        },
      });
      return newDonor;
    });
  },

  async softDelete(id: string, userId: string): Promise<Donor> {
    return prisma.$transaction(async (tx) => {
      const oldDonor = await tx.donor.findFirst({
        where: { id, deletedAt: null },
      });
      if (!oldDonor) throw new Error("Donatur tidak ditemukan");

      const newDonor = await tx.donor.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: "DELETE_DONATUR",
          tableName: "donors",
          recordId: newDonor.id,
          oldValue: oldDonor as unknown as Prisma.InputJsonValue,
          newValue: newDonor as unknown as Prisma.InputJsonValue,
        },
      });
      return newDonor;
    });
  },

  async paginate(options: {
    readonly cursor?: string | undefined;
    readonly limit: number;
  }): Promise<{ readonly items: readonly DonaturListItemDto[]; readonly nextCursor?: string | undefined }> {
    const limit = options.limit;
    const cursor = options.cursor;

    const donors = await prisma.donor.findMany({
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      where: { deletedAt: null },
      orderBy: { fullName: "asc" },
      include: {
        donations: {
          select: { amount: true, donationDate: true },
          orderBy: { donationDate: "desc" },
        },
      },
    });

    let nextCursor: string | undefined = undefined;
    if (donors.length > limit) {
      const nextItem = donors.pop();
      nextCursor = nextItem?.id;
    }

    const items = donors.map((d) => {
      const total = d.donations.reduce((sum, dn) => sum + Number(dn.amount), 0);
      const lastDonation = d.donations[0] ? d.donations[0].donationDate : null;
      return {
        id: d.id,
        fullName: d.fullName,
        address: d.address,
        phoneNumber: d.phoneNumber,
        totalDonations: total,
        lastDonationAt: lastDonation,
      };
    });

    return { items, nextCursor };
  },

  async search(
    query: string,
    options: { readonly cursor?: string | undefined; readonly limit: number }
  ): Promise<{ readonly items: readonly DonaturListItemDto[]; readonly nextCursor?: string | undefined }> {
    const limit = options.limit;
    const cursor = options.cursor;

    const donors = await prisma.donor.findMany({
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      where: {
        deletedAt: null,
        OR: [
          { fullName: { contains: query, mode: "insensitive" } },
          { phoneNumber: { contains: query } },
        ],
      },
      orderBy: { fullName: "asc" },
      include: {
        donations: {
          select: { amount: true, donationDate: true },
          orderBy: { donationDate: "desc" },
        },
      },
    });

    let nextCursor: string | undefined = undefined;
    if (donors.length > limit) {
      const nextItem = donors.pop();
      nextCursor = nextItem?.id;
    }

    const items = donors.map((d) => {
      const total = d.donations.reduce((sum, dn) => sum + Number(dn.amount), 0);
      const lastDonation = d.donations[0] ? d.donations[0].donationDate : null;
      return {
        id: d.id,
        fullName: d.fullName,
        address: d.address,
        phoneNumber: d.phoneNumber,
        totalDonations: total,
        lastDonationAt: lastDonation,
      };
    });

    return { items, nextCursor };
  },

  count(): Promise<number> {
    return prisma.donor.count({ where: { deletedAt: null } });
  },
};

export type DonorServiceType = typeof DonorService;
