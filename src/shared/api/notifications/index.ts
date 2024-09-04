import { handleJSON, http } from '@/shared/lib';

import type { Notification, NotificationSchedule } from '@/types';

const BASE_URL = '/api/notices';

export const fetchNotifications = (): Promise<Notification[]> =>
  http.get(BASE_URL).then(handleJSON);

export const markNotificationsRead = (noticeIds: number[]) =>
  http.patch(`${BASE_URL}`, { noticeIds });

export const deleteNotifications = (noticeIds: number[]) =>
  http.put(`${BASE_URL}`, { noticeIds });

export const markAllNotificationsRead = () => http.patch(`${BASE_URL}/all`);

export const fetchUnreadCount = (): Promise<number> =>
  http.get(`${BASE_URL}/unread`).then(handleJSON);

export const fetchSchedule = (): Promise<NotificationSchedule> =>
  http.get(`${BASE_URL}/schedule`).then(handleJSON);

export const updateSchedule = (schedule: NotificationSchedule) =>
  http.put(`${BASE_URL}/schedule`, schedule).then(handleJSON);
