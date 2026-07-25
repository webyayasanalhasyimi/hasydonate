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
        /* Ensure images are always rendered in print */
        #receipt-print-area img {
          display: block !important;
          visibility: visible !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          height: 210mm !important;
          overflow: hidden !important;
        }
        #receipt-print-area {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 148mm !important;
          height: 210mm !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          margin: 0 !important;
          padding: 8mm !important;
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
