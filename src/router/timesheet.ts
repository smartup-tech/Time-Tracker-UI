import { TeamRole, UserRole } from '@/constants';
import { paths, PageName } from '@/pages';
import { TimesheetPage } from '@/pages/tracker';
import { TimeFreezePage } from '@/pages/time-freeze';
import {
  ApprovalPage,
  ApprovalPeriodPage,
  ApprovalProjectPage,
} from '@/pages/timesheet-approval';

import type { RouteLocation } from 'vue-router';

export const timesheetRoutes = [
  {
    path: paths[PageName.TRACKER],
    name: PageName.TRACKER,
    component: TimesheetPage,
    props: ({ query }: RouteLocation) => ({
      startDate: query.ts,
      uid: /^\d+$/.test(query.uid as string)
        ? Number.parseInt(query.uid as string, 10)
        : undefined,
    }), 
    meta: {
      hasAccess: [UserRole.ROLE_ADMIN, UserRole.ROLE_USER],
    },
  },
  {
    path: paths[PageName.TIME_FREEZE],
    name: PageName.TIME_FREEZE,
    component: TimeFreezePage,
    hasAccess: [UserRole.ROLE_ADMIN],
  },
  {
    path: paths[PageName.TIMESHEET_APPROVAL],
    name: PageName.TIMESHEET_APPROVAL,
    component: ApprovalPage,
    hasAccess: [UserRole.ROLE_ADMIN, TeamRole.MANAGER],
  },
  {
    path: paths[PageName.TIMESHEET_APPROVAL_PERIOD],
    name: PageName.TIMESHEET_APPROVAL_PERIOD,
    component: ApprovalPeriodPage,
    props: true,
    hasAccess: [UserRole.ROLE_ADMIN, TeamRole.MANAGER],
  },
  {
    path: paths[PageName.TIMESHEET_APPROVAL_PROJECT],
    name: PageName.TIMESHEET_APPROVAL_PROJECT,
    component: ApprovalProjectPage,
    props: (route: RouteLocation) => ({
      weekStart: route.params.weekStart,
      projectId: Number.parseInt(route.params.projectId as string, 10),
    }),
    hasAccess: [UserRole.ROLE_ADMIN, TeamRole.MANAGER],
  },
];
