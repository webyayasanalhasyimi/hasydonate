export const SETTINGS_KEYS = {
  FOUNDATION_NAME: "foundation.name",
  FOUNDATION_ADDRESS: "foundation.address",
  FOUNDATION_PHONE: "foundation.phone",
  FOUNDATION_EMAIL: "foundation.email",
  FOUNDATION_WEBSITE: "foundation.website",
  FOUNDATION_LOGO_PATH: "foundation.logoPath",
  
  BANK_NAME: "bank.name",
  BANK_ACCOUNT_NUMBER: "bank.accountNumber",
  BANK_ACCOUNT_NAME: "bank.accountName",
  
  RECEIPT_FOOTER_MESSAGE: "receipt.footerMessage",
  RECEIPT_PREPARED_BY: "receipt.preparedBy",
  RECEIPT_SIGNATURE_NAME: "receipt.signatureName",
  RECEIPT_SIGNATURE_POSITION: "receipt.signaturePosition",
  RECEIPT_DEFAULT_TEMPLATE: "receipt.defaultTemplate",
} as const;

export const SETTINGS_DEFAULTS = {
  [SETTINGS_KEYS.FOUNDATION_NAME]: "YAYASAN PANTI ASUHAN AL-HASYIMI",
  [SETTINGS_KEYS.FOUNDATION_ADDRESS]: "Jl. Kedung Tomas II No.26A, Surabaya",
  [SETTINGS_KEYS.FOUNDATION_PHONE]: "087824429612",
  [SETTINGS_KEYS.FOUNDATION_EMAIL]: "info@alhasyimi.or.id",
  [SETTINGS_KEYS.FOUNDATION_WEBSITE]: "https://alhasyimi.or.id",
  [SETTINGS_KEYS.FOUNDATION_LOGO_PATH]: "",
  
  [SETTINGS_KEYS.BANK_NAME]: "BSI",
  [SETTINGS_KEYS.BANK_ACCOUNT_NUMBER]: "1106060618",
  [SETTINGS_KEYS.BANK_ACCOUNT_NAME]: "YAYASAN PANTI ASUHAN AL HASYIMI",
  
  [SETTINGS_KEYS.RECEIPT_FOOTER_MESSAGE]: "Atas nama pengurus dan seluruh anak asuh Yayasan Panti Asuhan Al-Hasyimi mengucapkan terima kasih atas kepercayaan dan donasi yang telah diberikan. Semoga Allah SWT membalas segala amal kebaikan Anda dengan keberkahan yang berlipat ganda. Jazakumullahu Khairan Katsiran.",
  [SETTINGS_KEYS.RECEIPT_PREPARED_BY]: "Yayasan Al-Hasyimi",
  [SETTINGS_KEYS.RECEIPT_SIGNATURE_NAME]: "Administrator",
  [SETTINGS_KEYS.RECEIPT_SIGNATURE_POSITION]: "Kepala Yayasan",
  [SETTINGS_KEYS.RECEIPT_DEFAULT_TEMPLATE]: "a5-default",
} as const;
