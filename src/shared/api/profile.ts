import { handleJSON, http } from '@/shared/lib';

import type { PasswordUpdate, Profile, ProfileUpdate } from '@/types';

const BASE_URL = '/api/profile';

export const fetchProfile = (): Promise<Profile> =>
  http.get(BASE_URL).then(handleJSON);

export const updateProfile = (profile: ProfileUpdate): Promise<Profile> =>
  http.patch(`${BASE_URL}/updatePersonalData`, profile).then(handleJSON);

export const updatePassword = (payload: PasswordUpdate): Promise<void> =>
  http.patch(`${BASE_URL}/updatePwd`, payload).then(handleJSON);
