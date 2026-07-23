import { describe, it, expect, vi } from "vitest";
import { generateDonationNumber } from "@/features/donation/lib/donation-number";
import { type Prisma } from "@prisma/client";

describe("generateDonationNumber", () => {
  it("generates sequence starting with 0001 when no donations exist", async () => {
    const mockTx = {
      donation: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    } as unknown as Prisma.TransactionClient;

    const date = new Date("2026-07-23T12:00:00+07:00");
    const result = await generateDonationNumber(mockTx, date);
    
    expect(result).toBe("AH-DON-20260723-0001");
  });

  it("increments sequential number based on latest donation prefix match", async () => {
    const mockTx = {
      donation: {
        findFirst: vi.fn().mockResolvedValue({
          donationNumber: "AH-DON-20260723-0027",
        }),
      },
    } as unknown as Prisma.TransactionClient;

    const date = new Date("2026-07-23T12:00:00+07:00");
    const result = await generateDonationNumber(mockTx, date);
    
    expect(result).toBe("AH-DON-20260723-0028");
  });
});
