declare module "@react-pdf/renderer" {
  import * as React from "react";

  export const Document: React.FC<Record<string, unknown>>;
  export const Page: React.FC<Record<string, unknown>>;
  export const Text: React.FC<Record<string, unknown>>;
  export const View: React.FC<Record<string, unknown>>;
  export const StyleSheet: {
    create: (styles: Record<string, unknown>) => Record<string, unknown>;
  };
  export const PDFViewer: React.FC<Record<string, unknown>>;
  export const pdf: (document: React.ReactElement) => {
    toBlob: () => Promise<Blob>;
  };
  export const PDFDownloadLink: React.FC<Record<string, unknown>>;
}
