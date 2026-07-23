import { describe, it, expect } from "vitest";
import { aggregateSummary } from "@/features/reports/lib/aggregators/summary";
import { aggregateTrend } from "@/features/reports/lib/aggregators/trend";
import { aggregateDistribution } from "@/features/reports/lib/aggregators/distribution";

describe("Report Aggregators", () => {
  describe("aggregateSummary", () => {
    it("computes averages correctly and preserves totals", () => {
      const summary = aggregateSummary(1000000, 5, 500000);
      expect(summary.totalAmount).toBe(1000000);
      expect(summary.totalCount).toBe(5);
      expect(summary.averageDonation).toBe(200000);
      expect(summary.largestDonation).toBe(500000);
    });

    it("handles zero values gracefully", () => {
      const summary = aggregateSummary(0, 0, 0);
      expect(summary.averageDonation).toBe(0);
      expect(summary.totalCount).toBe(0);
    });
  });

  describe("aggregateTrend", () => {
    it("pre-fills chronological series with zero values for dates without entries", () => {
      const dateStart = new Date("2026-07-01T00:00:00");
      const dateEnd = new Date("2026-07-03T23:59:59");
      const donations = [
        { amount: 150000, donationDate: new Date("2026-07-02T10:00:00") },
      ];

      const trend = aggregateTrend(donations, dateStart, dateEnd);
      expect(trend).toHaveLength(3);
      
      expect(trend[0]?.date).toBe("2026-07-01");
      expect(trend[0]?.amount).toBe(0);
      
      expect(trend[1]?.date).toBe("2026-07-02");
      expect(trend[1]?.amount).toBe(150000);
      expect(trend[1]?.count).toBe(1);

      expect(trend[2]?.date).toBe("2026-07-03");
      expect(trend[2]?.amount).toBe(0);
    });
  });

  describe("aggregateDistribution", () => {
    it("computes percentages and sets labels correctly", () => {
      const groups = [
        { id: "ZAKAT", count: 2, amount: 800000 },
        { id: "SHADAQAH", count: 1, amount: 200000 },
      ];

      const distribution = aggregateDistribution(groups, (id) => id);
      expect(distribution).toHaveLength(2);
      expect(distribution[0]?.percentage).toBe(80);
      expect(distribution[1]?.percentage).toBe(20);
    });
  });
});
