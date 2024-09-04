import { ErrorCode } from '@/shared/lib';

export const enum SortDirection {
  ASC = "ASC",
  DESC = "DESC"
}

export type PageableSort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

export type Pageable = {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: PageableSort;
  unpaged: boolean;
};

export interface PagedResponse<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: PageableSort;
  totalElements: number;
  totalPages: number;
}

export type PaginationParams = Pick<
  PagedResponse<object>,
  'number' | 'size' | 'totalElements' | 'totalPages'
>;

export type ApiErrorResponse = {
  errorCode: `${ErrorCode}`;
  errorMessage: string;
  relatedEntities: unknown[];
};

export interface PageableRequestParams {
  sortDirection?: SortDirection;
  page?: number;
  size?: number;
  sortBy?: string;
}

export interface SearchableRequestParams {
  query?: string;
  archive?: boolean;
}
