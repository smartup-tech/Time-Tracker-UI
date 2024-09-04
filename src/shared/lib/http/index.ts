import qs from 'qs';

import { HTTPException, UnauthorizedException } from '@/shared/exceptions';

const headers = {
  'Content-Type': 'application/json',
};

export const http = {
  get: (url: string, options?: RequestInit) =>
    fetch(url, {
      method: 'GET',
      headers,
      ...options,
    }),

  post: (url: string, body?: unknown, options?: RequestInit) =>
    fetch(url, {
      method: 'POST',
      headers,
      ...(body ? { body: JSON.stringify(body, jsonReplacer) } : {}),
      ...options,
    }),

  postData: (
    url: string,
    body: Record<string, string>,
    options?: RequestInit
  ) =>
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(body),
      ...options,
    }),

  put: (url: string, body?: unknown, options?: RequestInit) =>
    fetch(url, {
      method: 'PUT',
      headers,
      ...(body ? { body: JSON.stringify(body, jsonReplacer) } : {}),
      ...options,
    }),

  patch: (url: string, body?: unknown, options?: RequestInit) =>
    fetch(url, {
      method: 'PATCH',
      headers,
      ...(body ? { body: JSON.stringify(body, jsonReplacer) } : {}),
      ...options,
    }),

  delete: (url: string, body?: unknown, options?: RequestInit) =>
    fetch(url, {
      method: 'DELETE',
      headers,
      ...(body ? { body: JSON.stringify(body, jsonReplacer) } : {}),
      ...options,
    }),
};

export const jsonReplacer = (key: string, value: unknown) => {
  if (typeof value === 'string') {
    return value.trim() || null;
  }

  if (value === undefined) {
    return null;
  }

  return value;
};

export const handleJSON = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      throw new UnauthorizedException();
    }

    throw new HTTPException(response.status, await response.json());
  }

  return response.text().then((data) => (data ? JSON.parse(data) : {}));
};

export const stringifyQueryParams = (params?: unknown) => {
  return qs.stringify(params, {
    addQueryPrefix: true,
  });
};
