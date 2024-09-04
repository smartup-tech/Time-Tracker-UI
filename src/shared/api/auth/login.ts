import { http, handleJSON } from '@/shared/lib';

import type { Credentials } from '@/types';

const BASE_URL = '/api/auth';

export const login = async (credentials: Credentials) => {
  const response = await http.postData(`${BASE_URL}/login`, credentials);

  return handleJSON(response);
};

export const logout = () => http.get(`${BASE_URL}/logout`);
