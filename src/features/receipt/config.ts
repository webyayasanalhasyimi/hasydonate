export const RECEIPT_SETTINGS_KEYS = {
  FOUNDATION_NAME: "foundation.name",
  FOUNDATION_ADDRESS: "foundation.address",
  FOUNDATION_PHONE: "foundation.phone",
  BANK_NAME: "bank.name",
  BANK_ACCOUNT_NUMBER: "bank.accountNumber",
  BANK_ACCOUNT_NAME: "bank.accountName",
  FOOTER_MESSAGE: "receipt.footerMessage",
  SIGNATURE_NAME: "receipt.signatureName",
  SIGNATURE_POSITION: "receipt.signaturePosition",
} as const;

export const RECEIPT_SETTINGS_DEFAULTS = {
  [RECEIPT_SETTINGS_KEYS.FOUNDATION_NAME]: "YAYASAN PANTI ASUHAN AL-HASYIMI",
  [RECEIPT_SETTINGS_KEYS.FOUNDATION_ADDRESS]: "Jl. Kedung Tomas II No.26A, Surabaya",
  [RECEIPT_SETTINGS_KEYS.FOUNDATION_PHONE]: "087824429612",
  [RECEIPT_SETTINGS_KEYS.BANK_NAME]: "BSI",
  [RECEIPT_SETTINGS_KEYS.BANK_ACCOUNT_NUMBER]: "1106060618",
  [RECEIPT_SETTINGS_KEYS.BANK_ACCOUNT_NAME]: "YAYASAN PANTI ASUHAN AL HASYIMI",
  [RECEIPT_SETTINGS_KEYS.FOOTER_MESSAGE]: "Atas nama pengurus dan seluruh anak asuh Yayasan Panti Asuhan Al-Hasyimi mengucapkan terima kasih atas kepercayaan dan donasi yang telah diberikan. Semoga Allah SWT membalas segala amal kebaikan Anda dengan keberkahan yang berlipat ganda. Jazakumullahu Khairan Katsiran.",
  [RECEIPT_SETTINGS_KEYS.SIGNATURE_NAME]: "Administrator",
  [RECEIPT_SETTINGS_KEYS.SIGNATURE_POSITION]: "Kepala Yayasan",
} as const;

export const RECEIPT_ROUTES = {
  PREVIEW: (id: string) => `/dashboard/receipt/${id}`,
} as const;
