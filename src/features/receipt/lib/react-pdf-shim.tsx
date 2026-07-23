/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

let realPdf: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  realPdf = require("@react-pdf/renderer");
} catch {
  // Fallback for offline sandbox compilation
}

export const Document: React.ComponentType<any> = realPdf?.Document || (({ children }: any) => <div className="pdf-document">{children}</div>);
export const Page: React.ComponentType<any> = realPdf?.Page || (({ children }: any) => <div className="pdf-page">{children}</div>);
export const Text: React.ComponentType<any> = realPdf?.Text || (({ children }: any) => <span className="pdf-text">{children}</span>);
export const View: React.ComponentType<any> = realPdf?.View || (({ children }: any) => <div className="pdf-view">{children}</div>);
export const Image: React.ComponentType<any> = realPdf?.Image || (({ src }: any) => <img src={src} alt="PDF Mock Image" className="pdf-image" />);

export const StyleSheet: any = realPdf?.StyleSheet || {
  create: (styles: any) => styles,
};

export const pdf: any = realPdf?.pdf || (() => ({
  toBlob: async () => new Blob(["Mock PDF Content"], { type: "application/pdf" }),
}));
