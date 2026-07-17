import { type ReceiptTemplate } from "../types";
import { A5Template } from "./A5Template";

export const TemplateRegistry = {
  templates: [A5Template] as readonly ReceiptTemplate[],

  getById(id: string): ReceiptTemplate | undefined {
    return this.templates.find((t) => t.id === id);
  },

  getDefault(): ReceiptTemplate {
    return A5Template;
  },

  getByPaperSize(size: "A5" | "A4" | "THERMAL"): readonly ReceiptTemplate[] {
    return this.templates.filter((t) => t.paperSize === size);
  },
};
export type TemplateRegistryType = typeof TemplateRegistry;
