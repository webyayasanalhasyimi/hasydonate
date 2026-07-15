export const PAYMENT_METHODS = {
  CASH: "CASH",
  BANK_TRANSFER: "BANK_TRANSFER",
} as const;

export type PaymentMethodValue = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];
