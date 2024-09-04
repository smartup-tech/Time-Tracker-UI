import { TeamRole, UserRole } from '@/constants';
import { paths, PageName } from '@/pages';
import {
  ReportsPage,
  HoursPerUserReportPage,
  HoursPerProjectReportPage,
  PersonalHoursReportPage,
} from '@/pages/reports';

export const reportRoutes = [
  {
    path: paths[PageName.REPORTS],
    name: PageName.REPORTS,
    component: ReportsPage,
  },
  {
    path: paths[PageName.HOURS_PER_USER_REPORT],
    name: PageName.HOURS_PER_USER_REPORT,
    component: HoursPerUserReportPage,
    meta: {
      hasAccess: [
        UserRole.ROLE_ADMIN,
        UserRole.ROLE_REPORT_RECEIVER,
        TeamRole.MANAGER,
      ],
    },
  },
  {
    path: paths[PageName.HOURS_PER_PROJECT_REPORT],
    name: PageName.HOURS_PER_PROJECT_REPORT,
    component: HoursPerProjectReportPage,
    meta: {
      hasAccess: [
        UserRole.ROLE_ADMIN,
        UserRole.ROLE_REPORT_RECEIVER,
        TeamRole.MANAGER,
      ],
    },
  },
  {
    path: paths[PageName.PERSONAL_HOURS_REPORT],
    name: PageName.PERSONAL_HOURS_REPORT,
    component: PersonalHoursReportPage,
    meta: {
      hasAccess: [UserRole.ROLE_ADMIN, UserRole.ROLE_USER],
    },
  },
];
