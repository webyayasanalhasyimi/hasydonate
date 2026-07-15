export const STORAGE_BUCKETS = {
  TRANSFER_PROOFS: "transfer-proofs",
} as const;

export type StorageBucketValue = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];
