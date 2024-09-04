import md5 from 'md5';

import { UserRole, userRoles } from '@/constants';

import type { User } from '@/types';

type UserAlike = Pick<User, 'firstName' | 'lastName' | 'middleName'>;

export const getUserRoles = (user: User): string =>
  user.roles.map((role: string) => userRoles[role as UserRole]).join(', ') ||
  '';

export const getFullName = (user?: UserAlike | null): string =>
  user ? `${user.firstName} ${user.lastName}`.trim() : '';

export const getInitials = (user?: UserAlike | null): string => {
  const name = getFullName(user);

  return name
    .split(/\s/)
    .map((word) => word.charAt(0))
    .join('');
};

export const getEmailMd5 = (email = 'blank'): string => md5(email);

export const getGravatarUrl = (email: string, size = 250): string =>
  `https://www.gravatar.com/avatar/${getEmailMd5(email)}?s=${String(
    Math.max(size, 250)
  )}&d=blank`;

export const getProfileColors = (
  emailMd5: string
): { background: string; color: string } => {
  const matches = emailMd5.match(/.{2}/g);

  if (!matches) {
    return { background: '', color: '' };
  }

  const [red, green, blue] = matches.map((hex) => Number.parseInt(hex, 16));

  const luminance = (red * 0.299 + green * 0.587 + blue * 0.114) / 255;

  const color = luminance > 0.6 ? '#242425' : '#fff';

  return {
    background: `rgb(${[red, green, blue]})`,
    color,
  };
};
