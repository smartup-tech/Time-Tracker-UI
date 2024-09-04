import { handleJSON, http } from '@/shared/lib';

import type { CreateTask, Task, TaskDetails, UpdateTask } from '@/types';

const BASE_URL = '/api/tasks';

export const fetchTasks = (projectId: number): Promise<Task[]> =>
  http.get(`${BASE_URL}?projectId=${projectId}`).then(handleJSON);

export const fetchTaskById = (taskId: number): Promise<TaskDetails> =>
  http.get(`${BASE_URL}/${taskId}`).then(handleJSON);

export const createTask = (task: CreateTask): Promise<Task> =>
  http.post(BASE_URL, task).then(handleJSON);

export const updateTask = (task: UpdateTask): Promise<Task> =>
  http.patch(`${BASE_URL}/${task.id}`, task).then(handleJSON);

export const archiveTask = (taskId: number): Promise<Task> =>
  http.post(`${BASE_URL}/${taskId}/archive`).then(handleJSON);
