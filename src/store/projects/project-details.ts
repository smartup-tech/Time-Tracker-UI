import { defineStore } from 'pinia';

import {
  fetchProjectById,
  addToTeam,
  removeFromTeam,
  createTask,
  updateTask,
  archiveTask,
} from '@/shared/api';

import type {
  CreateTask,
  CreateTeamMember,
  Task,
  TeamMember,
  UpdateTask,
} from '@/types';

import type { ProjectDetailsState } from './types';

export const useProjectsDetailsStore = defineStore('project-details', {
  state: (): ProjectDetailsState => ({
    project: null,
    isFetching: false,
    isLoading: false,
  }),

  actions: {
    async fetchDetails(projectId?: number) {
      const id = projectId || this.projectId;

      if (!id) {
        return;
      }

      if (!this.project) {
        this.isLoading = true;
      }

      this.isFetching = true;

      try {
        const project = await fetchProjectById(id);

        this.project = project;
      } finally {
        this.isFetching = false;
        this.isLoading = false;
      }
    },

    async addToTeam(projectId: number, user: CreateTeamMember) {
      await addToTeam(projectId, user);
      await this.fetchDetails();
    },

    async removeFromTeam(projectId: number, userId: number) {
      await removeFromTeam(projectId, userId);
      await this.fetchDetails();
    },

    async createTask(task: CreateTask) {
      await createTask(task);
      this.fetchDetails();
    },

    async updateTask(task: UpdateTask) {
      if (!task?.id) {
        return;
      }

      await updateTask(task);
      await this.fetchDetails();
    },

    async archiveTask(taskId: number) {
      await archiveTask(taskId);
      await this.fetchDetails();
    },
  },

  getters: {
    projectId: (state): number | null => state.project?.id ?? null,

    tasks: (state): Task[] => state.project?.tasks || [],

    team: (state): TeamMember[] => state.project?.users || [],
  },
});
