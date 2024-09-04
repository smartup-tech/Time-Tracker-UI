import type { Task } from '@/types';

export type TasksState = {
  tasks: Task[];
  isLoading: boolean;
};
