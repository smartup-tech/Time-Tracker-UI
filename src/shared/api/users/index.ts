import { handleJSON, http, stringifyQueryParams } from '@/shared/lib';

import type { CreateUser, PagedResponse, User, UserDetails } from '@/types';
import type { UserArchiveRequestParams, UsersRequestParams } from './types';

export * from './types';

const BASE_URL = '/api/users';

export const fetchUsers = async (
  params?: UsersRequestParams
): Promise<PagedResponse<User>> => {
  const query = stringifyQueryParams(params);
  const response = await http.get(`${BASE_URL}${query}`);

  return handleJSON(response);
};

export const fetchUserById = (userId: number): Promise<UserDetails> =>
  http.get(`${BASE_URL}/${userId}`).then(handleJSON);

export const createUser = (user: CreateUser): Promise<User> =>
  http.post(BASE_URL, user).then(handleJSON);

export const updateUser = (
  userId: number,
  user: Partial<User>
): Promise<User> => http.patch(`${BASE_URL}/${userId}`, user).then(handleJSON);

export const archiveUser = async (
  userId: number,
  params?: UserArchiveRequestParams
): Promise<User> => {
  const query = stringifyQueryParams(params);
  const response = await http.post(`${BASE_URL}/${userId}/archive${query}`);

  return handleJSON(response);
};

export const unArchiveUser = async (
  userId: number): Promise<User> => {
  const response = await http.post(`${BASE_URL}/${userId}/unArchive`);
  return handleJSON(response);
};

export const fetchUsersForProject = async (
  projectId: number,
  query?: string
): Promise<User[]> => {
  const queryString = stringifyQueryParams({ projectId, query });
  const response = await http.get(`${BASE_URL}/project${queryString}`);

  return handleJSON(response);
};
