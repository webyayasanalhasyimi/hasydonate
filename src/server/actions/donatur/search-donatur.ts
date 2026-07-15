"use server";

import { listDonaturAction } from "./list-donatur";

export const searchDonaturAction = async (
  query: string,
  options: { readonly cursor?: string; readonly limit?: number } = {}
) => {
  return listDonaturAction({ query, ...options });
};
