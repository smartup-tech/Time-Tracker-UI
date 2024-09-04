import { NavigationGuard } from 'vue-router';

import { publicPages, PageName } from '@/pages';
import { useAuthStore } from '@/store';

export const authGuard: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore();
  const { isAuthenticated } = authStore;
  const authRequired = !publicPages.includes(to.path);
  const goesToLogin = to.name === PageName.LOGIN;

  if (authRequired && !isAuthenticated) {
    return next({
      name: PageName.LOGIN,
      query: {
        ...(!goesToLogin ? { next: to.fullPath } : {}),
      },
    });
  }

  if (goesToLogin && isAuthenticated) {
    return next('/');
  }

  return next();
};
