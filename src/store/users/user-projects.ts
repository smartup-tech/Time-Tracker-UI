import { defineStore } from 'pinia';

import { fetchProjectsByUserId, addToTeam, removeFromTeam } from '@/shared/api';

import type { UserProjectsState } from './types';

import type { CreateUserProject, CreateTeamMember } from '@/types';

export const useUserProjectsStore = defineStore('user-projects', {
  state: (): UserProjectsState => ({
    projects: [],
    isLoading: false,
  }),

  actions: {
    async fetchUserProjects(userId?: number) {
      if (!userId) {
        return;
      }

      this.isLoading = true;

      try {
        const projects = await fetchProjectsByUserId(userId);

        this.projects = projects;
      } finally {
        this.isLoading = false;
      }
    },

    async addUserToProject(userId: number, userProject: CreateUserProject) {
      const user: CreateTeamMember = {
        userId,
        ...userProject,
      };
      if (userProject.projectId) {
        await addToTeam(userProject.projectId, user);
        await this.fetchUserProjects(userId);
      }
    },

    async removeUserFromProject(userId: number, projectId: number) {
      await removeFromTeam(projectId, userId);
      await this.fetchUserProjects(userId);
    },
  },
});
