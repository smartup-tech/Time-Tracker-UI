import { defineStore } from 'pinia';

import { fetchActiveProjects } from '@/shared/api';

import type { Project } from '@/types';
import type { PickProjectState } from './types';

export const usePickProjectStore = defineStore('pick-project', {
  state: (): PickProjectState => ({
    projects: [],
    isLoading: false,
  }),

  actions: {
    async fetchActiveProjects() {
      this.isLoading = true;

      try {
        const projects = await fetchActiveProjects();

        this.setProjects(projects);
      } finally {
        this.isLoading = false;
      }
    },

    setProjects(projects: Project[]) {
      this.projects = projects;
    },

    reset() {
      this.$reset();
    },
  },
});
