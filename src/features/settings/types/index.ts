export interface FoundationSettingsDto {
  readonly foundationName: string;
  readonly foundationAddress: string;
  readonly foundationPhone: string;
  readonly foundationEmail: string;
  readonly foundationWebsite: string;
  readonly foundationLogoPath: string;
  
  readonly bankName: string;
  readonly bankAccountNumber: string;
  readonly bankAccountName: string;
  
  readonly receiptFooterMessage: string;
  readonly receiptPreparedBy: string;
  readonly receiptSignatureName: string;
  readonly receiptSignaturePosition: string;
  readonly receiptDefaultTemplate: string;
  readonly logoUrl?: string | undefined;
}
