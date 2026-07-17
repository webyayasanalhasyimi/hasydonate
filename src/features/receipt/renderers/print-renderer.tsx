import React from "react";
import { type ReceiptData } from "../types";
import { A5Template } from "../templates/A5Template";

/**
 * Triggers standard browser print dialog targeting A5 portrait styles.
 */
export function printReceipt(): void {
  if (typeof window !== "undefined") {
    window.print();
  }
}

/**
 * Printable styles block injection to override standard dashboard page layouts during printing.
 */
export function PrintStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @media print {
        /* Hide everything except the print receipt container */
        body * {
          visibility: hidden !important;
        }
        #receipt-print-area, #receipt-print-area * {
          visibility: visible !important;
        }
        #receipt-print-area {
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          width: 148mm !important;
          height: 210mm !important;
          margin: 0 !important;
          padding: 10mm !important;
          border: none !important;
          box-shadow: none !important;
          background: white !important;
          z-index: 9999999 !important;
        }
        /* Override page sizing */
        @page {
          size: A5 portrait;
          margin: 0 !important;
        }
      }
    `}} />
  );
}

export function PrintReceiptView({ data }: Readonly<{ data: ReceiptData }>) {
  return (
    <>
      <PrintStyles />
      {A5Template.render(data)}
    </>
  );
}
