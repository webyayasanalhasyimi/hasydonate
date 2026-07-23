import { prisma } from "@/lib/prisma/client";
import { DonationService } from "./donation.service";
import { SettingService } from "./setting.service";
import { SETTINGS_KEYS } from "@/constants/settings";
import { type CurrentUser } from "@/lib/auth/current-user";
import {
  type DashboardOverviewDto,
  type DashboardKpiItemDto,
  type DashboardTrendItemDto,
  type DashboardDistributionItemDto,
  type DashboardSystemStatusItemDto,
  type DashboardQuickActionItemDto,
} from "@/features/dashboard/types";
import { formatIDR } from "@/lib/utils/currency";

export const DashboardService = {
  async getOverview(currentUser: CurrentUser): Promise<DashboardOverviewDto> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // 1. Fetch data concurrently
    const [
      todaySummary,
      monthlySummary,
      donorCount,
      lifetimeAggregate,
      recentDonations,
      typeGroups,
      methodGroups,
      settings,
      donationsTrendData,
    ] = await Promise.all([
      DonationService.getTodaySummary(),
      DonationService.getMonthlySummary(),
      prisma.donor.count({ where: { deletedAt: null } }),
      prisma.donation.aggregate({
        _sum: { amount: true },
        _count: { id: true },
        where: { donor: { deletedAt: null } },
      }),
      DonationService.getRecentDonations(5),
      prisma.donation.groupBy({
        by: ["donationType"],
        _sum: { amount: true },
        _count: { id: true },
        where: { donor: { deletedAt: null } },
      }),
      prisma.donation.groupBy({
        by: ["paymentMethod"],
        _sum: { amount: true },
        _count: { id: true },
        where: { donor: { deletedAt: null } },
      }),
      SettingService.getAll(),
      prisma.donation.findMany({
        where: {
          donationDate: { gte: thirtyDaysAgo },
          donor: { deletedAt: null },
        },
        select: {
          amount: true,
          donationDate: true,
        },
      }),
    ]);

    // 2. Format KPIs
    const lifetimeAmount = lifetimeAggregate._sum.amount ? Number(lifetimeAggregate._sum.amount) : 0;
    const lifetimeCount = lifetimeAggregate._count.id || 0;
    const averageDonation = lifetimeCount > 0 ? lifetimeAmount / lifetimeCount : 0;

    const kpis: readonly DashboardKpiItemDto[] = [
      {
        id: "total-today",
        label: "Donasi Hari Ini",
        value: formatIDR(todaySummary.totalAmount),
        description: `${todaySummary.transactionCount} transaksi hari ini`,
        icon: "Wallet",
        trend: null,
      },
      {
        id: "total-month",
        label: "Donasi Bulan Ini",
        value: formatIDR(monthlySummary.totalAmount),
        description: `${monthlySummary.transactionCount} transaksi bulan ini`,
        icon: "FileText",
        trend: null,
      },
      {
        id: "total-donors",
        label: "Total Donatur",
        value: donorCount.toLocaleString("id-ID"),
        description: "Jumlah donatur aktif terdaftar",
        icon: "Users",
        trend: null,
      },
      {
        id: "average-donation",
        label: "Rata-rata Donasi",
        value: formatIDR(averageDonation),
        description: "Rata-rata nilai per donasi",
        icon: "DollarSign",
        trend: null,
      },
      {
        id: "total-lifetime",
        label: "Total Donasi (Lifetime)",
        value: formatIDR(lifetimeAmount),
        description: `Total dari ${lifetimeCount} transaksi keseluruhan`,
        icon: "Receipt",
        trend: null,
      },
    ];

    // 3. Process 30-Day Trend
    const trendMap: Record<string, { amount: number; count: number }> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(thirtyDaysAgo.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      trendMap[dateStr] = { amount: 0, count: 0 };
    }

    for (const donation of donationsTrendData) {
      const d = new Date(donation.donationDate);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      if (trendMap[dateStr]) {
        trendMap[dateStr].amount += Number(donation.amount);
        trendMap[dateStr].count += 1;
      }
    }

    const trend: readonly DashboardTrendItemDto[] = Object.entries(trendMap)
      .map(([date, val]) => ({
        date,
        amount: val.amount,
        count: val.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 4. Distribution Calculations
    const typeTotalAmount = typeGroups.reduce((acc, g) => acc + (g._sum.amount ? Number(g._sum.amount) : 0), 0);
    const typeDistribution: readonly DashboardDistributionItemDto[] = typeGroups.map((g) => {
      const amt = g._sum.amount ? Number(g._sum.amount) : 0;
      const pct = typeTotalAmount > 0 ? (amt / typeTotalAmount) * 100 : 0;
      return {
        id: g.donationType,
        label: g.donationType,
        count: g._count.id || 0,
        amount: amt,
        percentage: parseFloat(pct.toFixed(1)),
      };
    });

    const methodTotalAmount = methodGroups.reduce((acc, g) => acc + (g._sum.amount ? Number(g._sum.amount) : 0), 0);
    const methodDistribution: readonly DashboardDistributionItemDto[] = methodGroups.map((g) => {
      const amt = g._sum.amount ? Number(g._sum.amount) : 0;
      const pct = methodTotalAmount > 0 ? (amt / methodTotalAmount) * 100 : 0;
      return {
        id: g.paymentMethod,
        label: g.paymentMethod === "CASH" ? "Tunai (Cash)" : "Transfer Bank",
        count: g._count.id || 0,
        amount: amt,
        percentage: parseFloat(pct.toFixed(1)),
      };
    });

    // 5. System Config Status Checks
    const getSetting = (key: string): string => {
      const found = settings.find((s) => s.key === key);
      return found ? found.value : "";
    };

    const hasLogo = !!getSetting(SETTINGS_KEYS.FOUNDATION_LOGO_PATH);
    const hasBank =
      !!getSetting(SETTINGS_KEYS.BANK_NAME) &&
      !!getSetting(SETTINGS_KEYS.BANK_ACCOUNT_NUMBER) &&
      !!getSetting(SETTINGS_KEYS.BANK_ACCOUNT_NAME);
    const hasTemplate = !!getSetting(SETTINGS_KEYS.RECEIPT_DEFAULT_TEMPLATE);
    const hasBaseConfig =
      !!getSetting(SETTINGS_KEYS.FOUNDATION_NAME) &&
      !!getSetting(SETTINGS_KEYS.FOUNDATION_ADDRESS) &&
      !!getSetting(SETTINGS_KEYS.FOUNDATION_PHONE);

    const systemStatus: readonly DashboardSystemStatusItemDto[] = [
      {
        id: "logo-check",
        label: "Logo Yayasan",
        status: hasLogo ? "SUCCESS" : "WARNING",
        description: hasLogo
          ? "Logo yayasan telah diunggah dan terkonfigurasi."
          : "Logo yayasan belum diunggah. Tampilan kwitansi menggunakan default logo.",
      },
      {
        id: "bank-check",
        label: "Informasi Bank Rekening",
        status: hasBank ? "SUCCESS" : "DANGER",
        description: hasBank
          ? "Informasi rekening bank penerima donasi telah lengkap."
          : "Informasi rekening bank belum diisi. Pengaturan ini dibutuhkan untuk kwitansi transfer.",
      },
      {
        id: "template-check",
        label: "Template Default Kwitansi",
        status: hasTemplate ? "SUCCESS" : "WARNING",
        description: hasTemplate
          ? "Template cetak kwitansi default telah diatur."
          : "Template kwitansi belum dipilih secara eksplisit.",
      },
      {
        id: "base-check",
        label: "Profil Dasar Yayasan",
        status: hasBaseConfig ? "SUCCESS" : "DANGER",
        description: hasBaseConfig
          ? "Profil dasar (nama, alamat, telepon) telah diisi."
          : "Profil dasar belum lengkap. Harap segera lengkapi di halaman pengaturan.",
      },
    ];

    // 6. Quick Actions Configurations (filtered dynamically based on Role in UI or server)
    const quickActionsList: readonly DashboardQuickActionItemDto[] = [
      {
        id: "new-donation",
        label: "Input Donasi Baru",
        href: "/dashboard/donation/new",
        icon: "Plus",
      },
      {
        id: "manage-donors",
        label: "Kelola Donatur",
        href: "/dashboard/donatur",
        icon: "Users",
      },
      {
        id: "settings-admin",
        label: "Pengaturan Yayasan",
        href: "/dashboard/settings",
        icon: "Settings",
        requiredRole: "ADMIN",
      },
    ];

    return {
      kpis,
      trend,
      typeDistribution,
      methodDistribution,
      recentDonations,
      systemStatus,
      quickActions: quickActionsList.filter(
        (action) => !action.requiredRole || action.requiredRole === currentUser.profile.role
      ),
    };
  },
};
export type DashboardServiceType = typeof DashboardService;
