import type { PaginationParams, SortDirection, User, UserProject } from '@/types';

export type UsersState = {
  users: User[];
  pagination: PaginationParams;
  sorting: {
    sortBy: string;
    sortDirection: SortDirection;
  };
  isLoading: boolean;
};

export type PickUserState = {
  users: User[];
  isLoading: boolean;
};

export type UserProjectsState = {
  projects: UserProject[];
  isLoading: boolean;
};
