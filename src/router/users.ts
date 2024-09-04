import { RouteLocation } from 'vue-router';

import { UserRole } from '@/constants';
import { paths, PageName } from '@/pages';
import { UserCreatePage, UserListPage, UserEditPage } from '@/pages/users';

export const usersRoutes = [
  {
    path: paths[PageName.USERS],
    name: PageName.USERS,
    component: UserListPage,
    meta: {
      hasAccess: [UserRole.ROLE_ADMIN],
    },
  },
  {
    path: paths[PageName.USER_EDIT],
    name: PageName.USER_EDIT,
    component: UserEditPage,
    props: (route: RouteLocation) => ({
      userId: route.params.userId
        ? Number.parseInt(route.params.userId as string, 10)
        : undefined,
    }),
    meta: {
      hasAccess: [UserRole.ROLE_ADMIN],
    },
  },
  {
    path: paths[PageName.USER_EDIT_PROJECTS],
    name: PageName.USER_EDIT_PROJECTS,
    component: UserEditPage,
    props: (route: RouteLocation) => ({
      userId: route.params.userId
        ? Number.parseInt(route.params.userId as string, 10)
        : undefined,
    }),
    meta: {
      hasAccess: [UserRole.ROLE_ADMIN],
    },
  },
  {
    path: paths[PageName.USER_CREATE],
    name: PageName.USER_CREATE,
    component: UserCreatePage,
    meta: {
      hasAccess: [UserRole.ROLE_ADMIN],
    },
  },
];
