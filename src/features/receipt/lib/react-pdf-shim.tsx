/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import * as realPdf from "@react-pdf/renderer";


const getProp = (module: any, prop: string) => {
  if (!module) return undefined;
  return module[prop] !== undefined ? module[prop] : module.default?.[prop];
};

export const Document: React.ComponentType<any> = getProp(realPdf, "Document") || (({ children }: any) => <div className="pdf-document">{children}</div>);
export const Page: React.ComponentType<any> = getProp(realPdf, "Page") || (({ children }: any) => <div className="pdf-page">{children}</div>);
export const Text: React.ComponentType<any> = getProp(realPdf, "Text") || (({ children }: any) => <span className="pdf-text">{children}</span>);
export const View: React.ComponentType<any> = getProp(realPdf, "View") || (({ children }: any) => <div className="pdf-view">{children}</div>);
export const Image: React.ComponentType<any> = getProp(realPdf, "Image") || (({ src }: any) => <img src={src} alt="PDF Mock Image" className="pdf-image" />);

export const StyleSheet: any = getProp(realPdf, "StyleSheet") || {
  create: (styles: any) => styles,
};

export const pdf: any = getProp(realPdf, "pdf") || (() => ({
  toBlob: async () => new Blob(["Mock PDF Content"], { type: "application/pdf" }),
}));

export const Font: any = getProp(realPdf, "Font") || {
  register: () => {},
};
