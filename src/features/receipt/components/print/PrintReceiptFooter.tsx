import React from "react";
import { type ReceiptData } from "../../types";

export function PrintReceiptFooter({ data }: Readonly<{ data: ReceiptData }>) {
  return (
    <div className="border-t border-dashed border-border pt-3 space-y-3 text-[9px] text-muted-foreground text-center">
      {/* Thank You Message */}
      <p className="italic text-foreground leading-normal px-2">
        {data.thankYouMessage}
      </p>
    </div>
  );
}
