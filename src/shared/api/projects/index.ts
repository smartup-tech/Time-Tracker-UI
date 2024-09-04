import { handleJSON, http, stringifyQueryParams } from '@/shared/lib';

import type {
  CreateTeamMember,
  EditProject,
  PagedResponse,
  Project,
  ProjectDetails,
  UserProject,
} from '@/types';
import type { ProjectsRequestParams } from './types';

const BASE_URL = '/api/projects';

export * from './types';

export const fetchProjects = async (
  params?: ProjectsRequestParams
): Promise<PagedResponse<Project>> => {
  const query = stringifyQueryParams(params);

  const response = await http.get(`${BASE_URL}${query}`);

  return handleJSON(response);
};

export const fetchProjectById = (projectId: number): Promise<ProjectDetails> =>
  http.get(`${BASE_URL}/${projectId}`).then(handleJSON);

export const fetchProjectsByUserId = async (
  userId: number
): Promise<UserProject[]> => {
  const query = stringifyQueryParams({ userId });
  const response = await http.get(`${BASE_URL}/user${query}`);

  return handleJSON(response);
};

export const fetchActiveProjects = (): Promise<Project[]> =>
  http.get(`${BASE_URL}/active`).then(handleJSON);

export const createProject = (project: Partial<Project>): Promise<Project> =>
  http.post(BASE_URL, project).then(handleJSON);

export const updateProject = (
  projectId: number,
  project: EditProject
): Promise<Project> =>
  http.patch(`${BASE_URL}/${projectId}`, project).then(handleJSON);

export const archiveProject = (projectId: number): Promise<Project> =>
  http.post(`${BASE_URL}/${projectId}/archive`).then(handleJSON);

export const addToTeam = (
  projectId: number,
  user: CreateTeamMember
): Promise<Project> =>
  http
    .post(`${BASE_URL}/${projectId}/modifyProjectUser`, user)
    .then(handleJSON);

export const removeFromTeam = (projectId: number, userId: number) =>
  http
    .post(`${BASE_URL}/${projectId}/deleteProjectUser`, { userId })
    .then(handleJSON);
