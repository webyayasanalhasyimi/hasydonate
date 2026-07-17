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
  
  let result = "";
  if (num < 12) {
    result = units[num] || "";
  } else if (num < 20) {
    result = spellNumberIndonesian(num - 10) + " Belas";
  } else if (num < 100) {
    result = spellNumberIndonesian(Math.floor(num / 10)) + " Puluh " + spellNumberIndonesian(num % 10);
  } else if (num < 200) {
    result = "Seratus " + spellNumberIndonesian(num - 100);
  } else if (num < 1000) {
    result = spellNumberIndonesian(Math.floor(num / 100)) + " Ratus " + spellNumberIndonesian(num % 100);
  } else if (num < 2000) {
    result = "Seribu " + spellNumberIndonesian(num - 1000);
  } else if (num < 1000000) {
    result = spellNumberIndonesian(Math.floor(num / 1000)) + " Ribu " + spellNumberIndonesian(num % 1000);
  } else if (num < 1000000000) {
    result = spellNumberIndonesian(Math.floor(num / 1000000)) + " Juta " + spellNumberIndonesian(num % 1000000);
  } else {
    result = String(num);
  }
  
  return result.trim().replace(/\s+/g, " ") + " Rupiah";
};

