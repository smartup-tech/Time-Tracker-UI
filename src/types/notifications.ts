import { NotificationType, TeamRole } from '@/constants';

import type { Project } from './projects';
import type { TimesheetUnit } from './timesheet';
import type { User } from './users';

type Changemap = Record<
  string,
  {
    newValue: string | number | boolean;
    oldValue: string | number | boolean;
  }
>;

export interface BaseNotification {
  createdBy: number;
  createdDate: string;
  id: number;
  data?: unknown;
  read: boolean;
  text: string;
  type: `${NotificationType}`;
}

export interface NotificationProjectUpdate extends BaseNotification {
  type: NotificationType.PROJECT_UPDATE;
  data: {
    project: Pick<Project, 'id' | 'name'>;
    changes: Changemap;
  };
}

export interface NotificationProjectRoleChange extends BaseNotification {
  type: NotificationType.PROJECT_ROLE_CHANGE;
  data: {
    project: Pick<Project, 'id' | 'name'>;
    changes: {
      projectRole: {
        oldValue: `${TeamRole}`;
        newValue: `${TeamRole}`;
      };
    };
  };
}

export interface NotificationProjectAccessGranted extends BaseNotification {
  type: NotificationType.PROJECT_ROLE_GRANTED;
  data: {
    project: Pick<Project, 'id' | 'name'>;
    user: {
      projectRole: `${TeamRole}`;
    };
  };
}

export interface NotificationAdminChange extends BaseNotification {
  type: NotificationType.ADMIN_ADDED | NotificationType.ADMIN_REMOVED;
  data: {
    user: Pick<User, 'id' | 'firstName' | 'lastName'>;
  };
}

export interface NotificationHoursRejected extends BaseNotification {
  type: NotificationType.HOURS_REJECTED;
  data: {
    project: {
      id: number;
      name: string;
    };
    task: {
      id: number;
      name: string;
    };
    unit: Pick<TimesheetUnit, 'id' | 'workDay'>;
  };
}

export interface NotificationApprovalRequired extends BaseNotification {
  type: NotificationType.APPROVAL_REQUIRED;
  data: {
    usersHours: {
      numberUsers: number;
      projectId: number;
      sumHours: number;
    };
  };
}

export interface NotificationFreeze extends BaseNotification {
  type: NotificationType.FREEZE_SUCCESS | NotificationType.FREEZE_ERROR;
  data: {
    date: string;
  };
}

export interface NotificationUnfreeze extends BaseNotification {
  type: NotificationType.UN_FREEZE | NotificationType.FREEZE_ERROR;
  data: {
    unfreezeRecordDate: string;
    freezeDate: string;
  };
}

export type Notification =
  | NotificationProjectUpdate
  | NotificationProjectRoleChange
  | NotificationProjectAccessGranted
  | NotificationAdminChange
  | NotificationHoursRejected
  | NotificationApprovalRequired
  | NotificationUnfreeze
  | NotificationFreeze;

export interface NotificationSchedule {
  days: number[];
}
