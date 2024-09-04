export enum UserRole {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_REPORT_RECEIVER = 'ROLE_REPORT_RECEIVER',
}

export const userRoles = {
  [UserRole.ROLE_USER]: 'Пользователь',
  [UserRole.ROLE_ADMIN]: 'Администратор',
  [UserRole.ROLE_REPORT_RECEIVER]: 'Просмотр отчетов',
};

export enum TeamRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
}

export const teamRoles: Record<TeamRole, string> = {
  [TeamRole.EMPLOYEE]: 'Пользователь',
  [TeamRole.MANAGER]: 'Менеджер проекта',
};

export enum TimesheetUnitStatus {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export const REQUEST_DEBOUNCE_TIMEOUT = 500;

export const EMAIL_MAX_LENGTH = 254;

export enum DateFormat {
  ISO_DATE = 'YYYY-MM-DD',
  ISO_DATE_TIME = 'YYYY-MM-DD HH:mm:ss',
  SLASH = 'D/M/YYYY',
  DOT = 'D.M.YYYY',
  TIME = 'H:mm',
  DAY_MONTH = 'D MMM',
  DAY_MONTH_SHORT = 'D/MM',
  DAY_MONTH_TIME = 'D MMM, H:mm',
  DAY_MONTH_YEAR = 'D MMMM YYYY',
  DAY_MONTH_YEAR_TIME = 'D MMM YYYY, H:mm',
}

export enum NotificationType {
  PROJECT_UPDATE = 'PROJECT_UPDATE',
  PROJECT_ROLE_CHANGE = 'PROJECT_ROLE_CHANGE',
  PROJECT_ROLE_GRANTED = 'PROJECT_ROLE_GRANTED',
  ADMIN_REMOVED = 'ADMIN_REMOVED',
  ADMIN_ADDED = 'ADMIN_ADDED',
  HOURS_REJECTED = 'HOURS_REJECTED',
  APPROVAL_REQUIRED = 'APPROVAL_REQUIRED',
  FREEZE_SUCCESS = 'FREEZE_SUCCESS',
  FREEZE_PREPARE = 'FREEZE_PREPARE',
  FREEZE_ERROR = 'FREEZE_ERROR',
  UN_FREEZE = 'UN_FREEZE',
}

export const Days = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье',
];

export const FEEDBACK_LINK = 'https://forms.gle/PvZD7maqKFCng2Ux7';
