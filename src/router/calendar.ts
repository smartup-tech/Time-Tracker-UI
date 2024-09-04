import { UserRole } from '@/constants';
import { paths, PageName } from '@/pages';
import { ProductionCalendarCreatePage, ProductionCalendarDisplayPage } from '@/pages/calendar';

export const calendarRoutes = [
  {
    path: paths[PageName.PRODUCTION_CALENDAR],
    name: PageName.PRODUCTION_CALENDAR,
    component: ProductionCalendarDisplayPage,
    meta: {
      hasAccess: [
        UserRole.ROLE_USER,
        UserRole.ROLE_REPORT_RECEIVER,
        UserRole.ROLE_ADMIN,
      ],
    },
  },
  {
    path: paths[PageName.PRODUCTION_CALENDAR_CREATE],
    name: PageName.PRODUCTION_CALENDAR_CREATE,
    component: ProductionCalendarCreatePage,
    meta: {
      hasAccess: [
        UserRole.ROLE_ADMIN,
      ],
    },
  },
];
