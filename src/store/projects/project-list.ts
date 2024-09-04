import { defineStore } from 'pinia';

import {
  createProject,
  archiveProject,
  fetchProjects,
  updateProject,
  fetchProjectById,
} from '@/shared/api';

import { ProjectOrderBy } from './config';

import {  type EditProject, type PaginationParams, type Project } from '@/types';
import type { ProjectsRequestParams } from '@/shared/api';
import type { ProjectsState } from './types';

export const useProjectsStore = defineStore('projects', {
  state: (): ProjectsState => ({
    projects: [],
    pagination: {
      number: 0,
      size: 10,
      totalPages: 0,
      totalElements: 0,
    },
    sorting: {
      sortBy: ProjectOrderBy.name,
      desc: false
    },
    isLoading: false,
  }),

  actions: {
    async fetchProjects(params?: ProjectsRequestParams) {
      this.isLoading = true;

      try {
        const {
          content: projects,
          number,
          size,
          totalPages,
          totalElements,
        } = await fetchProjects({
          size: this.pagination.size,
          page: this.pagination.number,
          ...this.sorting,
          ...params,
        });

        this.projects = projects;
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

    async fetchProjectById(projectId: number) {
      return await fetchProjectById(projectId);
    },

    async createProject(project: Partial<Project>) {
      await createProject(project);
    },

    async updateProject(projectId: number, project: EditProject) {
      await updateProject(projectId, project);
    },

    async archiveProject(projectId: number) {
      await archiveProject(projectId);
    },

    setPagination(params: Partial<PaginationParams>) {
      this.pagination = {
        ...this.pagination,
        ...params,
      };
    },
  },

  getters: {
    getProjectById:
      (state: ProjectsState) =>
      (projectId: number): Project | undefined =>
        state.projects.find((project: Project) => projectId === project.id),

    getActiveProjects: (state: ProjectsState): Project[] =>
      state.projects.filter((project: Project) => !project.archived),
  },
});
