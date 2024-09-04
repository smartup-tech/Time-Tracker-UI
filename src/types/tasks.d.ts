export interface Task {
  archived: boolean;
  billable: boolean;
  id: number;
  name: string;
}

export interface CreateTask extends Pick<Task, 'name' | 'billable'> {
  projectId: number;
}

export interface UpdateTask extends Pick<Task, 'id' | 'name' | 'billable'> {
  projectId: number;
}

export interface TaskDetails extends Task {
  createdDate: string;
  lastModifiedDate: string;
  projectId: number;
}
