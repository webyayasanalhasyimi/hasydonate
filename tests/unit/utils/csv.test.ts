import { describe, it, expect } from "vitest";
import { serializeToCsv } from "@/features/reports/lib/aggregators/csv";

describe("serializeToCsv", () => {
  it("prepends UTF-8 BOM prefix and joins cells with commas", () => {
    const headers = ["Nama", "Email"];
    const rows = [
      ["Budi", "budi@gmail.com"],
      ["Siti", "siti@gmail.com"],
    ];

    const csv = serializeToCsv(headers, rows);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("Nama,Email\nBudi,budi@gmail.com\nSiti,siti@gmail.com");
  });

  it("escapes cells containing commas, quotes, or newlines", () => {
    const headers = ["Alamat", "Komentar"];
    const rows = [
      ['Jl. Raya, No. 12', 'Dia berkata "Halo"'],
      ["Line1\nLine2", "Normal text"],
    ];

    const csv = serializeToCsv(headers, rows);
    expect(csv).toContain('"Jl. Raya, No. 12"');
    expect(csv).toContain('"Dia berkata ""Halo"""');
    expect(csv).toContain('"Line1\nLine2"');
  });
});
