import React from "react";
import { type ReceiptData } from "../types";
import { A5Template } from "../templates/A5Template";

export type PaperSize = "A5" | "A4";

/**
 * Triggers standard browser print dialog targeting A5 or A4 portrait styles.
 */
export function printReceipt(paperSize: PaperSize = "A5"): void {
  if (typeof window !== "undefined") {
    let styleEl = document.getElementById("dynamic-print-paper-size") as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "dynamic-print-paper-size";
      document.head.appendChild(styleEl);
    }

    if (paperSize === "A4") {
      styleEl.textContent = `
        @media print {
          @page {
            size: A4 portrait;
            margin: 0 !important;
          }
          #receipt-print-area {
            width: 210mm !important;
            min-height: 297mm !important;
            padding: 12mm !important;
          }
        }
      `;
    } else {
      styleEl.textContent = `
        @media print {
          @page {
            size: A5 portrait;
            margin: 0 !important;
          }
          #receipt-print-area {
            width: 148mm !important;
            min-height: 210mm !important;
            padding: 8mm !important;
          }
        }
      `;
    }

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
        /* Collapse body height so hidden content doesn't generate blank pages */
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
        }
        /* Hide all content */
        body * {
          visibility: hidden !important;
        }
        /* Show only the receipt */
        #receipt-print-area, #receipt-print-area * {
          visibility: visible !important;
        }
        /* Ensure images always render */
        #receipt-print-area img {
          display: block !important;
          visibility: visible !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        /* position:fixed takes the receipt out of normal flow,
           preventing extra blank pages from the rest of the DOM */
        #receipt-print-area {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 148mm !important;
          height: auto !important;
          min-height: 210mm !important;
          box-sizing: border-box !important;
          overflow: visible !important;
          margin: 0 !important;
          padding: 8mm !important;
          border: none !important;
          box-shadow: none !important;
          background: white !important;
          z-index: 9999999 !important;
        }
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
