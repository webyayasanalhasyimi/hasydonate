import { type Prisma } from "@prisma/client";

/**
 * Generates the next sequential donation number in the format: AH-DON-YYYYMMDD-XXXX
 * Queries the latest donation created on the same day within the transaction scope.
 */
export async function generateDonationNumber(
  tx: Prisma.TransactionClient,
  date: Date
): Promise<string> {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value || "";
  const month = parts.find((p) => p.type === "month")?.value || "";
  const day = parts.find((p) => p.type === "day")?.value || "";
  const dateStr = `${year}${month}${day}`;

  const prefix = `AH-DON-${dateStr}-`;

  // Query the latest donation matching today's prefix inside the transaction
  const latestDonation = await tx.donation.findFirst({
    where: {
      donationNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      donationNumber: "desc",
    },
    select: {
      donationNumber: true,
    },
  });

  let nextSeq = 1;
  if (latestDonation) {
    const parts = latestDonation.donationNumber.split("-");
    const lastSeqStr = parts[parts.length - 1];
    if (lastSeqStr) {
      const lastSeq = parseInt(lastSeqStr, 10);
      if (!isNaN(lastSeq)) {
        nextSeq = lastSeq + 1;
      }
    }
  }

  const seqStr = String(nextSeq).padStart(4, "0");
  return `${prefix}${seqStr}`;
}
export type GenerateDonationNumberFn = typeof generateDonationNumber;
