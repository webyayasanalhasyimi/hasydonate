export const formatWhatsAppNumber = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }

  if (!cleaned.startsWith("62") && cleaned.length > 0 && !cleaned.startsWith("6")) {
    cleaned = "62" + cleaned;
  }

  return cleaned;
};
