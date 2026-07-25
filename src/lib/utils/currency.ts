export const formatIDR = (amount: number | string): string => {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) {
    return "Rp 0";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

export const spellNumberIndonesian = (num: number): string => {
  const units = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
  
  if (num === 0) return "Nol";
  
  const spell = (n: number): string => {
    if (n < 12) {
      return units[n] || "";
    } else if (n < 20) {
      return spell(n - 10) + " Belas";
    } else if (n < 100) {
      const remainder = n % 10;
      return (spell(Math.floor(n / 10)) + " Puluh " + (remainder ? spell(remainder) : "")).trim();
    } else if (n < 200) {
      const remainder = n - 100;
      return ("Seratus " + (remainder ? spell(remainder) : "")).trim();
    } else if (n < 1000) {
      const remainder = n % 100;
      return (spell(Math.floor(n / 100)) + " Ratus " + (remainder ? spell(remainder) : "")).trim();
    } else if (n < 2000) {
      const remainder = n - 1000;
      return ("Seribu " + (remainder ? spell(remainder) : "")).trim();
    } else if (n < 1000000) {
      const remainder = n % 1000;
      return (spell(Math.floor(n / 1000)) + " Ribu " + (remainder ? spell(remainder) : "")).trim();
    } else if (n < 1000000000) {
      const remainder = n % 1000000;
      return (spell(Math.floor(n / 1000000)) + " Juta " + (remainder ? spell(remainder) : "")).trim();
    } else if (n < 1000000000000) {
      const remainder = n % 1000000000;
      return (spell(Math.floor(n / 1000000000)) + " Miliar " + (remainder ? spell(remainder) : "")).trim();
    } else {
      const remainder = n % 1000000000000;
      return (spell(Math.floor(n / 1000000000000)) + " Triliun " + (remainder ? spell(remainder) : "")).trim();
    }
  };
  
  return spell(num).trim().replace(/\s+/g, " ") + " Rupiah";
};

