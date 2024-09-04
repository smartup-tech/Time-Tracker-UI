import { UserRole } from '@/constants';

export enum PageName {
  LOGIN = 'login',
  LOGOUT = 'logout',
  ACCOUNT = 'account',
  PASSWORD_RECOVERY = 'password-recovery',
  RESET_PASSWORD = 'reset-password',
  SET_PASSWORD = 'set-password',
  POSITION_LIST = 'positions',
  POSITION_CREATE = 'position-create',
  POSITION_EDIT = 'position-edit',
  PROJECTS = 'projects',
  PROJECT_CREATE = 'projects-create',
  PROJECT_DETAILS = 'projects-details',
  PROJECTS_EDIT = 'projects-edit',
  PROFILE = 'profile',
  USERS = 'users',
  USER_CREATE = 'create-user',
  USER_EDIT = 'edit-user',
  USER_EDIT_PROJECTS = 'edit-user-projects',
  TRACKER = 'tracker',
  TIME_FREEZE = 'time-freeze',
  TIMESHEET_APPROVAL = 'timesheet-approval',
  TIMESHEET_APPROVAL_PERIOD = 'timesheet-approval-period',
  TIMESHEET_APPROVAL_PROJECT = 'timesheet-approval-project',
  REPORTS = 'reports',
  HOURS_PER_USER_REPORT = 'hours-per-user-report',
  HOURS_PER_PROJECT_REPORT = 'hours-per-project-report',
  PERSONAL_HOURS_REPORT = 'personal-hours-report',
  PRODUCTION_CALENDAR = 'calendar',
  PRODUCTION_CALENDAR_CREATE = 'calendar/create',
}

export const paths = {
  [PageName.LOGIN]: '/login',
  [PageName.LOGOUT]: '/logout',
  [PageName.PASSWORD_RECOVERY]: '/password-recovery',
  [PageName.RESET_PASSWORD]: '/reset-password',
  [PageName.SET_PASSWORD]: '/set-password',
  [PageName.POSITION_LIST]: '/positions',
  [PageName.POSITION_CREATE]: '/positions/create',
  [PageName.POSITION_EDIT]: '/positions/:positionId',
  [PageName.PROJECTS]: '/projects',
  [PageName.PROJECT_CREATE]: '/projects/create',
  [PageName.PROJECT_DETAILS]: '/projects/:projectId',
  [PageName.PROJECTS_EDIT]: '/projects/:projectId/edit',
  [PageName.PROFILE]: '/profile',
  [PageName.USERS]: '/users',
  [PageName.USER_CREATE]: '/users/create',
  [PageName.USER_EDIT]: '/users/:userId',
  [PageName.USER_EDIT_PROJECTS]: '/users/:userId/projects',
  [PageName.TRACKER]: '/tracker',
  [PageName.TIME_FREEZE]: '/time-freeze',
  [PageName.TIMESHEET_APPROVAL]: '/timesheet-approval',
  [PageName.TIMESHEET_APPROVAL_PERIOD]: '/timesheet-approval/:weekStart',
  [PageName.TIMESHEET_APPROVAL_PROJECT]:
    '/timesheet-approval/:weekStart/:projectId(\\d+)',
  [PageName.REPORTS]: '/reports',
  [PageName.HOURS_PER_USER_REPORT]: '/reports/hours-per-user',
  [PageName.HOURS_PER_PROJECT_REPORT]: '/reports/hours-per-project',
  [PageName.PERSONAL_HOURS_REPORT]: '/reports/personal-hours',
  [PageName.PRODUCTION_CALENDAR]: '/calendar',
  [PageName.PRODUCTION_CALENDAR_CREATE]: '/calendar/create',
};

export const DEFAULT_PAGE = PageName.TRACKER;

export const HOME_PAGE: Record<string, string> = {
  default: DEFAULT_PAGE,
  [UserRole.ROLE_USER]: PageName.TRACKER,
  [UserRole.ROLE_ADMIN]: PageName.TRACKER,
  [UserRole.ROLE_REPORT_RECEIVER]: PageName.REPORTS,
};

export const publicPages = [
  paths[PageName.LOGIN],
  paths[PageName.PASSWORD_RECOVERY],
  paths[PageName.RESET_PASSWORD],
  paths[PageName.SET_PASSWORD],
];
