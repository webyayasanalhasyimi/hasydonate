"use server";

import { type Result } from "@/types/action";
import { type ReceiptData } from "@/features/receipt/types";
import { generateReceiptAction } from "./generate-receipt";

export const getReceiptAction = async (donationId: string): Promise<Result<ReceiptData>> => {
  return generateReceiptAction(donationId);
};
