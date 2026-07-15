export interface PaginationParams {
  readonly page?: number;
  readonly limit?: number;
}

export interface PaginationMeta {
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  readonly data: readonly T[];
  readonly meta: PaginationMeta;
}
