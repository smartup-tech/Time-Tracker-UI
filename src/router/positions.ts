import { RouteLocation } from 'vue-router';

import { UserRole } from '@/constants';
import { paths, PageName } from '@/pages';
import {
  PositionCreatePage,
  PositionEditPage,
  PositionListPage,
} from '@/pages/positions';

export const positionRoutes = [
  {
    path: paths[PageName.POSITION_LIST],
    name: PageName.POSITION_LIST,
    component: PositionListPage,
    meta: {
      hasAccess: [UserRole.ROLE_ADMIN],
    },
  },
  {
    path: paths[PageName.POSITION_EDIT],
    name: PageName.POSITION_EDIT,
    component: PositionEditPage,
    props: (route: RouteLocation) => ({
      positionId: route.params.positionId
        ? Number.parseInt(route.params.positionId as string, 10)
        : undefined,
    }),
    meta: {
      hasAccess: [UserRole.ROLE_ADMIN],
    },
  },
  {
    path: paths[PageName.POSITION_CREATE],
    name: PageName.POSITION_CREATE,
    component: PositionCreatePage,
    meta: {
      hasAccess: [UserRole.ROLE_ADMIN],
    },
  },
];
