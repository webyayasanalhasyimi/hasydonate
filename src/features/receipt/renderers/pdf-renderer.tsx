import React from "react";
import { pdf } from "../lib/react-pdf-shim";
import { A5PdfTemplate } from "../templates/A5PdfTemplate";
import { type ReceiptData } from "../types";

/**
 * Transactional PDF generation returning a raw Blob for client download/viewing.
 */
export async function generateReceiptPdfBlob(data: ReceiptData): Promise<Blob> {
  const element = React.createElement(A5PdfTemplate, { data });
  const instance = pdf(element);
  return instance.toBlob();
}
