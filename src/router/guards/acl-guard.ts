import { NavigationGuard } from 'vue-router';

import { TeamRole, UserRole } from '@/constants';
import { useAuthStore } from '@/store';

import type { Role } from '@/types';

export const aclGuard: NavigationGuard = (to, from, next) => {
  const { profile } = useAuthStore();

  if (!to.meta?.hasAccess) {
    return next();
  }

  if (
    Array.isArray(to.meta.hasAccess) &&
    to.meta.hasAccess.some(
      (role: Role) =>
        profile?.roles?.includes(role as UserRole) ||
        profile?.projectRoles?.includes(role as TeamRole)
    )
  ) {
    return next();
  }

  return next('/');
};
