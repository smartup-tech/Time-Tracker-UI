import { defineStore } from 'pinia';

import {
  fetchProjectsByEmployeeId,
  addToTeam,
  removeFromTeam,
} from '@/shared/api';

import type { UserProjectsState } from './types';

import type { CreateUserProject, CreateTeamMember } from '@/types';

export const useUserProjectsStore = defineStore('user-projects', {
  state: (): UserProjectsState => ({
    projects: [],
    isLoading: false,
  }),

  actions: {
    async fetchUserProjects(employeeId?: number) {
      if (!employeeId) {
        return;
      }

      this.isLoading = true;

      try {
        const projects = await fetchProjectsByEmployeeId(employeeId);

        this.projects = projects;
      } finally {
        this.isLoading = false;
      }
    },

    async addUserToProject(employeeId: number, userProject: CreateUserProject) {
      const user: CreateTeamMember = {
        employeeId,
        ...userProject,
      };
      if (userProject.projectId) {
        await addToTeam(userProject.projectId, user);
        await this.fetchUserProjects(employeeId);
      }
    },

    async removeUserFromProject(employeeId: number, projectId: number) {
      await removeFromTeam(projectId, employeeId);
      await this.fetchUserProjects(employeeId);
    },
  },
});
