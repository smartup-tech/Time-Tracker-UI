import { defineStore } from 'pinia';

import {
  archivePosition,
  createPosition,
  fetchActivePositions,
  fetchAllPositions,
  fetchPositionById,
  updatePosition,
} from '@/shared/api';

import { PositionOrderBy } from './config';

import type { CreatePosition, PaginationParams, Position } from '@/types';
import type { PositionsRequestParams } from '@/shared/api';
import type { PositionsState } from './types';

export * from './config';

export const usePositionStore = defineStore('positions', {
  state: (): PositionsState => ({
    activePositions: [],
    positions: [],
    isLoading: false,
    pagination: {
      number: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    },
    query: '',
    archive: false,
    sorting: {
      sortBy: PositionOrderBy.name,
      desc: false,
    },
  }),

  getters: {},

  actions: {
    async fetchAll(params?: PositionsRequestParams) {
      this.isLoading = true;

      try {
        const {
          content: positions,
          number,
          size,
          totalPages,
          totalElements,
        } = await fetchAllPositions({
          page: this.pagination.number,
          size: this.pagination.size,
          query: this.query,
          archive: this.archive,
          ...this.sorting,
          ...params,
        });

        this.setPositions(positions);
        this.setPagination({
          number,
          size,
          totalPages,
          totalElements,
        });
      } finally {
        this.isLoading = false;
      }
    },

    async fetchActive() {
      this.isLoading = true;

      try {
        const positions = await fetchActivePositions();

        this.setActivePositions(positions);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchById(positionId: number) {
      return await fetchPositionById(positionId);
    },

    async createPosition(position: CreatePosition) {
      await createPosition(position);
    },

    async updatePosition(id: number, { name, externalRate }: CreatePosition) {
      await updatePosition(id, { name, externalRate });
    },

    async archivePosition(positionId: number) {
      await archivePosition(positionId);
      await this.fetchAll({
        ...this.pagination,
        ...this.sorting,
      });
    },

    setActivePositions(positions: Position[]) {
      this.activePositions = positions;
    },

    setPositions(positions: Position[]) {
      this.positions = positions;
    },

    setPagination(params: Partial<PaginationParams>) {
      this.pagination = {
        ...this.pagination,
        ...params,
      };
    },

    setQuery(query: string) {
      this.query = query;
    },

    setArchive(archive: boolean) {
      this.archive = archive;
    },
  },
});
