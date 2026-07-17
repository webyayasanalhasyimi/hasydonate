import React from "react";
import { type ReceiptTemplate, type ReceiptData } from "../types";
import { PrintReceiptHeader } from "../components/print/PrintReceiptHeader";
import { PrintReceiptFoundation } from "../components/print/PrintReceiptFoundation";
import { PrintReceiptDonatur } from "../components/print/PrintReceiptDonatur";
import { PrintReceiptDonation } from "../components/print/PrintReceiptDonation";
import { PrintReceiptPayment } from "../components/print/PrintReceiptPayment";
import { PrintReceiptAmount } from "../components/print/PrintReceiptAmount";
import { PrintReceiptSignature } from "../components/print/PrintReceiptSignature";
import { PrintReceiptFooter } from "../components/print/PrintReceiptFooter";

export const A5Template: ReceiptTemplate = {
  id: "a5-default",
  name: "A5 Portrait Default",
  paperSize: "A5",
  render: (data: ReceiptData) => {
    return (
      <div 
        id="receipt-print-area" 
        className="w-full max-w-[148mm] min-h-[210mm] bg-white p-[10mm] shadow-none border-0 box-border flex flex-col justify-between gap-4 font-sans select-text relative"
        style={{ contentVisibility: "auto" }}
      >
        {/* Future Watermark Support */}
        {data.watermarkText && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none z-0">
            <span className="text-4xl font-black rotate-45 uppercase tracking-widest">
              {data.watermarkText}
            </span>
          </div>
        )}

        <div className="space-y-4 z-10">
          <PrintReceiptHeader data={data} />
          <PrintReceiptFoundation data={data} />
          <PrintReceiptDonatur data={data} />
          <PrintReceiptDonation data={data} />
          <PrintReceiptPayment data={data} />
          <PrintReceiptAmount data={data} />
        </div>

        <div className="space-y-4 z-10 border-t border-dashed border-border pt-4">
          <PrintReceiptSignature data={data} />
          <PrintReceiptFooter data={data} />
        </div>
      </div>
    );
  },
};
