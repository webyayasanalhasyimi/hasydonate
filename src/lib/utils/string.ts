export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, " ");
};

export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + "...";
};
