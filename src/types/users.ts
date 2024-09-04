import { UserRole, TeamRole } from '@/constants';

import type { Position, Project } from '@/types';

export interface PersonalData {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
}

export interface User extends PersonalData {
  archived: boolean;
  id: number;
  roles: `${UserRole}`[];
}

export interface UserDetails extends User {
  position: Position;
  projectRoles: Record<number, `${TeamRole}`[]>;
}

export interface CreateUser extends PersonalData {
  password?: string;
  positionId?: number;
  roles: `${UserRole}`[];
}

export type UpdateUser = Partial<CreateUser>;

export interface Profile extends PersonalData {
  id: number;
  projectRoles: `${TeamRole}`[];
  roles: `${UserRole}`[];
}

export type ProfileUpdate = Partial<Omit<PersonalData, 'email'>>;

export interface PasswordUpdate {
  newPassword?: string;
  oldPassword?: string;
}

export type Role = `${UserRole}` | `${TeamRole}`;

export interface UserProject extends Project {
  projectRoleId: `${TeamRole}`;
  externalRate?: number;
}

export type CreateUserProject = {
  projectId: number | null;
  projectRoleId: `${TeamRole}`;
  externalRate?: number;
};
