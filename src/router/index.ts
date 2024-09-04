import { createWebHistory, createRouter } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import { HOME_PAGE } from '@/pages';

import { authRoutes } from './auth';
import { positionRoutes } from './positions';
import { projectsRoutes } from './projects';
import { profileRoutes } from './profile';
import { reportRoutes } from './reports';
import { timesheetRoutes } from './timesheet';
import { usersRoutes } from './users';
import { calendarRoutes } from './calendar';
import { aclGuard, authGuard } from './guards';
import { useAuthStore } from '@/store';

const PageLayout = () => import('@/shared/ui/PageLayout/PageLayout.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () => {
      const { profile } = useAuthStore();
      const homePage = HOME_PAGE[profile?.roles[0] || 'default'];

      return homePage || HOME_PAGE['default'];
    },
    component: PageLayout,
    children: [
      ...positionRoutes,
      ...projectsRoutes,
      ...profileRoutes,
      ...reportRoutes,
      ...timesheetRoutes,
      ...usersRoutes,
      ...calendarRoutes,
    ],
  },
  ...authRoutes,
  {
    path: '/:pathMatch(.*)',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);
router.beforeEach(aclGuard);

export default router;
