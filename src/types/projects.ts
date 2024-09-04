import { TeamRole } from '@/constants';

import type { Task } from './tasks';
import type { User } from './users';

export interface Project {
  id: number;
  name: string;
  archived: boolean;
}

export type CreateProject = Pick<Project, 'name'>;
export type EditProject = Pick<Project, 'name'>;

export interface ProjectDetails extends Project {
  createdDate: string;
  lastModifiedDate: string;
  tasks: Task[];
  users: TeamMember[];
}

export interface TeamMember
  extends Pick<User, 'id' | 'firstName' | 'lastName' | 'middleName'> {
  projectRoleId: `${TeamRole}`;
  externalRate?: number;
}

export type CreateTeamMember = {
  userId: number | null;
  projectRoleId: `${TeamRole}`;
  externalRate?: number;
};
