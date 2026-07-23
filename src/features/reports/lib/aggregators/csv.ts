export function serializeToCsv(
  headers: readonly string[],
  rows: ReadonlyArray<readonly string[]>
): string {
  const escapeCell = (val: string): string => {
    const clean = val.replace(/"/g, '""');
    if (clean.includes(",") || clean.includes("\n") || clean.includes("\r") || clean.includes('"')) {
      return `"${clean}"`;
    }
    return clean;
  };

  const headerRow = headers.map(escapeCell).join(",");
  const bodyRows = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
  
  // Return with UTF-8 BOM prefix for Microsoft Excel compatibility
  return `\uFEFF${headerRow}\n${bodyRows}`;
}
export type SerializeToCsvType = typeof serializeToCsv;
