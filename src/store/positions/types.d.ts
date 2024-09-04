import type { PaginationParams, Position } from '@/types';

export type PositionsState = {
  positions: Position[];
  activePositions: Position[];
  isLoading: boolean;
  pagination: PaginationParams;
  query: string;
  archive: boolean;
  sorting: {
    sortBy: string;
    desc: boolean;
  };
};
