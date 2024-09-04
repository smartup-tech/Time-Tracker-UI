import { defineStore } from 'pinia';

import {
  archiveTask,
  createTask,
  fetchTaskById,
  fetchTasks,
  updateTask,
} from '@/shared/api';

import type { CreateTask, UpdateTask } from '@/types';
import type { TasksState } from './types';

export const useTasksStore = defineStore('tasks', {
  state: (): TasksState => ({
    tasks: [],
    isLoading: false,
  }),

  actions: {
    async fetchProjectTasks(projectId: number) {
      if (!projectId) {
        return;
      }

      this.isLoading = true;

      const tasks = await fetchTasks(projectId);

      this.tasks = tasks;
      this.isLoading = false;
    },

    async fetchById(taskId: number) {
      return fetchTaskById(taskId);
    },

    async createTask(task: CreateTask) {
      await createTask(task);
    },

    async updateTask(task: UpdateTask) {
      await updateTask(task);
    },

    async archiveTask(taskId: number) {
      await archiveTask(taskId);
    },
  },
});
