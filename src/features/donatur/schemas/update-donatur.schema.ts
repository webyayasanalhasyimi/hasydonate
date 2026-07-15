import { z } from "zod";
import { createDonorSchema } from "./create-donatur.schema";

export const updateDonorSchema = createDonorSchema;

export type UpdateDonorInput = z.infer<typeof updateDonorSchema>;
