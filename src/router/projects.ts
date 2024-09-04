import { RouteLocation } from 'vue-router';

import { UserRole, TeamRole } from '@/constants';
import { paths, PageName } from '@/pages';
import {
  ProjectCreatePage,
  ProjectEditPage,
  ProjectListPage,
  ProjectDetailsPage,
} from '@/pages/projects';

export const projectsRoutes = [
  {
    path: paths[PageName.PROJECTS],
    name: PageName.PROJECTS,
    component: ProjectListPage,
    meta: {
      hasAccess: [UserRole.ROLE_ADMIN, TeamRole.MANAGER],
    },
  },
  {
    path: paths[PageName.PROJECT_DETAILS],
    name: PageName.PROJECT_DETAILS,
    component: ProjectDetailsPage,
    props: (route: RouteLocation) => ({
      projectId: route.params.projectId
        ? Number.parseInt(route.params.projectId as string, 10)
        : undefined,
    }),
    meta: {
      hasAccess: [UserRole.ROLE_ADMIN, TeamRole.MANAGER],
    },
  },
  {
    path: paths[PageName.PROJECTS_EDIT],
    name: PageName.PROJECTS_EDIT,
    component: ProjectEditPage,
    props: (route: RouteLocation) => ({
      projectId: route.params.projectId
        ? Number.parseInt(route.params.projectId as string, 10)
        : undefined,
    }),
    meta: {
      hasAccess: [UserRole.ROLE_ADMIN, TeamRole.MANAGER],
    },
  },
  {
    path: paths[PageName.PROJECT_CREATE],
    name: PageName.PROJECT_CREATE,
    component: ProjectCreatePage,
    meta: {
      hasAccess: [UserRole.ROLE_ADMIN],
    },
  },
];
