import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import { type ReportFilterInputDto, type ReportResultDto, type ReportRowDto } from "@/features/reports/types";
import { aggregateSummary } from "@/features/reports/lib/aggregators/summary";
import { aggregateTrend } from "@/features/reports/lib/aggregators/trend";
import { aggregateDistribution } from "@/features/reports/lib/aggregators/distribution";

function parseDateRange(filters: ReportFilterInputDto) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const start = filters.dateStart ? new Date(filters.dateStart) : thirtyDaysAgo;
  start.setHours(0, 0, 0, 0);
  const end = filters.dateEnd ? new Date(filters.dateEnd) : today;
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function buildWhereClause(
  filters: ReportFilterInputDto,
  start: Date,
  end: Date
): Prisma.DonationWhereInput {
  return {
    donor: { deletedAt: null },
    donationDate: {
      gte: start,
      lte: end,
    },
    ...(filters.donationType ? { donationType: filters.donationType } : {}),
    ...(filters.paymentMethod ? { paymentMethod: filters.paymentMethod } : {}),
    ...(filters.donorId ? { donorId: filters.donorId } : {}),
    ...(filters.minAmount !== undefined || filters.maxAmount !== undefined
      ? {
          amount: {
            ...(filters.minAmount !== undefined ? { gte: new Prisma.Decimal(filters.minAmount) } : {}),
            ...(filters.maxAmount !== undefined ? { lte: new Prisma.Decimal(filters.maxAmount) } : {}),
          },
        }
      : {}),
    ...(filters.searchKeyword
      ? {
          OR: [
            { donationNumber: { contains: filters.searchKeyword, mode: "insensitive" } },
            { donor: { fullName: { contains: filters.searchKeyword, mode: "insensitive" } } },
          ],
        }
      : {}),
  };
}

export const ReportService = {
  async generateReport(filters: ReportFilterInputDto): Promise<ReportResultDto> {
    const { start, end } = parseDateRange(filters);
    const where = buildWhereClause(filters, start, end);

    const limit = filters.limit ?? 10;
    const cursor = filters.cursor;

    // 3. Query all components concurrently
    const [
      aggregateMetrics,
      typeGroups,
      methodGroups,
      trendData,
      donationRows,
    ] = await Promise.all([
      prisma.donation.aggregate({
        _sum: { amount: true },
        _count: { id: true },
        _max: { amount: true },
        where,
      }),
      prisma.donation.groupBy({
        by: ["donationType"],
        _sum: { amount: true },
        _count: { id: true },
        where,
      }),
      prisma.donation.groupBy({
        by: ["paymentMethod"],
        _sum: { amount: true },
        _count: { id: true },
        where,
      }),
      prisma.donation.findMany({
        select: { amount: true, donationDate: true },
        where,
        orderBy: { donationDate: "asc" },
      }),
      prisma.donation.findMany({
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        where,
        orderBy: { donationDate: "desc" },
        include: {
          donor: true,
          receiver: true,
        },
      }),
    ]);

    // 4. Compose aggregates using specialized helpers
    const totalAmount = aggregateMetrics._sum.amount ? Number(aggregateMetrics._sum.amount) : 0;
    const totalCount = aggregateMetrics._count.id || 0;
    const largestDonation = aggregateMetrics._max.amount ? Number(aggregateMetrics._max.amount) : 0;

    const summary = aggregateSummary(totalAmount, totalCount, largestDonation);
    const trend = aggregateTrend(trendData, start, end);

    const typeDistribution = aggregateDistribution(
      typeGroups.map((g) => ({
        id: g.donationType,
        count: g._count.id || 0,
        amount: g._sum.amount ? Number(g._sum.amount) : 0,
      })),
      (id) => id
    );

    const methodDistribution = aggregateDistribution(
      methodGroups.map((g) => ({
        id: g.paymentMethod,
        count: g._count.id || 0,
        amount: g._sum.amount ? Number(g._sum.amount) : 0,
      })),
      (id) => (id === "CASH" ? "Tunai (Cash)" : "Transfer Bank")
    );

    // 5. Paginate and map rows
    let nextCursor: string | undefined = undefined;
    const items = [...donationRows];
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }

    const rows: readonly ReportRowDto[] = items.map((d) => ({
      id: d.id,
      donationNumber: d.donationNumber,
      donorName: d.donor.fullName,
      donationType: d.donationType,
      paymentMethod: d.paymentMethod,
      amount: Number(d.amount),
      donationDate: d.donationDate,
      receivedByName: d.receiver.fullName,
    }));

    return {
      summary,
      trend,
      typeDistribution,
      methodDistribution,
      rows,
      nextCursor,
    };
  },

  async getExportData(filters: ReportFilterInputDto): Promise<readonly ReportRowDto[]> {
    const { start, end } = parseDateRange(filters);
    const where = buildWhereClause(filters, start, end);

    const donations = await prisma.donation.findMany({
      where,
      orderBy: { donationDate: "desc" },
      include: {
        donor: true,
        receiver: true,
      },
    });

    return donations.map((d) => ({
      id: d.id,
      donationNumber: d.donationNumber,
      donorName: d.donor.fullName,
      donationType: d.donationType,
      paymentMethod: d.paymentMethod,
      amount: Number(d.amount),
      donationDate: d.donationDate,
      receivedByName: d.receiver.fullName,
    }));
  },
};
export type ReportServiceType = typeof ReportService;
