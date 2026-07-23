import { type Setting } from "@prisma/client";
import { type FoundationSettingsDto } from "../types";
import { SETTINGS_KEYS, SETTINGS_DEFAULTS } from "@/constants/settings";

export const mapSettingsToDto = (settings: readonly Setting[]): FoundationSettingsDto => {
  const getVal = (key: string): string => {
    const found = settings.find((s) => s.key === key);
    return found ? found.value : (SETTINGS_DEFAULTS as Record<string, string>)[key] || "";
  };

  return {
    foundationName: getVal(SETTINGS_KEYS.FOUNDATION_NAME),
    foundationAddress: getVal(SETTINGS_KEYS.FOUNDATION_ADDRESS),
    foundationPhone: getVal(SETTINGS_KEYS.FOUNDATION_PHONE),
    foundationEmail: getVal(SETTINGS_KEYS.FOUNDATION_EMAIL),
    foundationWebsite: getVal(SETTINGS_KEYS.FOUNDATION_WEBSITE),
    foundationLogoPath: getVal(SETTINGS_KEYS.FOUNDATION_LOGO_PATH),
    
    bankName: getVal(SETTINGS_KEYS.BANK_NAME),
    bankAccountNumber: getVal(SETTINGS_KEYS.BANK_ACCOUNT_NUMBER),
    bankAccountName: getVal(SETTINGS_KEYS.BANK_ACCOUNT_NAME),
    
    receiptFooterMessage: getVal(SETTINGS_KEYS.RECEIPT_FOOTER_MESSAGE),
    receiptPreparedBy: getVal(SETTINGS_KEYS.RECEIPT_PREPARED_BY),
    receiptSignatureName: getVal(SETTINGS_KEYS.RECEIPT_SIGNATURE_NAME),
    receiptSignaturePosition: getVal(SETTINGS_KEYS.RECEIPT_SIGNATURE_POSITION),
    receiptDefaultTemplate: getVal(SETTINGS_KEYS.RECEIPT_DEFAULT_TEMPLATE),
  };
};

export const mapDtoToRecord = (dto: FoundationSettingsDto): Record<string, string> => {
  return {
    [SETTINGS_KEYS.FOUNDATION_NAME]: dto.foundationName,
    [SETTINGS_KEYS.FOUNDATION_ADDRESS]: dto.foundationAddress,
    [SETTINGS_KEYS.FOUNDATION_PHONE]: dto.foundationPhone,
    [SETTINGS_KEYS.FOUNDATION_EMAIL]: dto.foundationEmail,
    [SETTINGS_KEYS.FOUNDATION_WEBSITE]: dto.foundationWebsite,
    [SETTINGS_KEYS.FOUNDATION_LOGO_PATH]: dto.foundationLogoPath,
    
    [SETTINGS_KEYS.BANK_NAME]: dto.bankName,
    [SETTINGS_KEYS.BANK_ACCOUNT_NUMBER]: dto.bankAccountNumber,
    [SETTINGS_KEYS.BANK_ACCOUNT_NAME]: dto.bankAccountName,
    
    [SETTINGS_KEYS.RECEIPT_FOOTER_MESSAGE]: dto.receiptFooterMessage,
    [SETTINGS_KEYS.RECEIPT_PREPARED_BY]: dto.receiptPreparedBy,
    [SETTINGS_KEYS.RECEIPT_SIGNATURE_NAME]: dto.receiptSignatureName,
    [SETTINGS_KEYS.RECEIPT_SIGNATURE_POSITION]: dto.receiptSignaturePosition,
    [SETTINGS_KEYS.RECEIPT_DEFAULT_TEMPLATE]: dto.receiptDefaultTemplate,
  };
};
