import { defineStore } from 'pinia';

import {
  createUser,
  archiveUser,
  fetchUserById,
  fetchUsers,
  updateUser,
  unArchiveUser,
} from '@/shared/api';

import { UserOrderBy } from './config';

import {
  type User,
  type CreateUser,
  type PaginationParams,
  type UpdateUser,
  type UserDetails,
} from '@/types';

import { SortDirection } from '@/types/api';

// erorr
import type {
  UsersRequestParams,
  UserArchiveRequestParams,
} from '@/shared/api';
import { type UsersState } from './types';

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    users: [],
    isLoading: false,
    pagination: {
      number: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    },
    sorting: {
      sortBy: UserOrderBy.name,
      sortDirection: SortDirection.ASC,
    },
  }),

  actions: {
    async fetchUsers(params?: UsersRequestParams) {
      this.isLoading = true;

      try {
        const {
          content: users,
          number,
          size,
          totalElements,
          totalPages,
        } = await fetchUsers({
          size: this.pagination.size,
          ...this.sorting,
          ...params,
        });

        this.users = users;
        this.setPagination({ number, size, totalElements, totalPages });
        this.setSorting({ sortBy: params?.sortBy, sortDirection: params?.sortDirection });
      } finally {
        this.isLoading = false;
      }
    },

    async fetchById(userId: number): Promise<UserDetails> {
      this.isLoading = true;

      try {
        const user = await fetchUserById(userId);

        return user;
      } finally {
        this.isLoading = false;
      }
    },

    async createUser(user: CreateUser): Promise<User> {
      return await createUser(user);
    },

    async updateUser(userId: number, user: UpdateUser) {
      await updateUser(userId, user);
    },

    async archiveUser(userId: number, params?: UserArchiveRequestParams) {
      await archiveUser(userId, params);
    },

    async unArchiveUser(userId: number) {
      await unArchiveUser(userId);
    },

    setPagination(params: Partial<PaginationParams>) {
      this.pagination = {
        ...this.pagination,
        ...params,
      };
    },

    setSorting(params: Partial<UsersState['sorting']>) {
      this.sorting = {
        ...this.sorting,
        sortBy: params.sortBy || 'NAME',
        sortDirection: params.sortDirection || SortDirection.ASC,
      };
    },
  },

  getters: {
    getUserById: (state) => (userId: number) =>
      state.users.find((user) => userId === user.id),
  },
});
