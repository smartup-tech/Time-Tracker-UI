import { Component, computed, defineAsyncComponent } from 'vue';

import { NotificationType } from '@/constants';

import { NotificationBase } from '../notification-base';

import type { Notification } from '@/types';

export const useNotificationComponent = (type: Notification['type']) => {
  const ProjectUpdate = defineAsyncComponent({
    loader: () =>
      import('../notification-project-update/NotificationProjectUpdate.vue'),
    loadingComponent: NotificationBase,
  });

  const ProjectRoleChange = defineAsyncComponent({
    loader: () =>
      import(
        '../notification-project-role-change/NotificationProjectRoleChange.vue'
      ),
    loadingComponent: NotificationBase,
  });

  const ProjectRoleGranted = defineAsyncComponent({
    loader: () =>
      import(
        '../notification-project-role-granted/NotificationProjectRoleGranted.vue'
      ),
    loadingComponent: NotificationBase,
  });

  const AdminChange = defineAsyncComponent({
    loader: () =>
      import('../notification-admin-change/NotificationAdminChange.vue'),
    loadingComponent: NotificationBase,
  });

  const HoursRejected = defineAsyncComponent({
    loader: () =>
      import('../notification-hours-rejected/NotificationHoursRejected.vue'),
    loadingComponent: NotificationBase,
  });

  const HoursApproval = defineAsyncComponent({
    loader: () =>
      import('../notification-hours-approval/NotificationHoursApproval.vue'),
    loadingComponent: NotificationBase,
  });

  const FreezeSuccess = defineAsyncComponent({
    loader: () =>
      import('../notification-freeze-success/NotificationFreezeSuccess.vue'),
    loadingComponent: NotificationBase,
  });

  const FreezePrepare = defineAsyncComponent({
    loader: () =>
      import('../notification-freeze-prepare/NotificationFreezePrepare.vue'),
    loadingComponent: NotificationBase,
  });

  const FreezeError = defineAsyncComponent({
    loader: () =>
      import('../notification-freeze-error/NotificationFreezeError.vue'),
    loadingComponent: NotificationBase,
  });

  const Unfreeze = defineAsyncComponent({
    loader: () => 
      import('../notification-unfreeze/NotificationUnfreeze.vue')
  })

  const components: Record<string, Component> = {
    [NotificationType.PROJECT_UPDATE]: ProjectUpdate,
    [NotificationType.PROJECT_ROLE_CHANGE]: ProjectRoleChange,
    [NotificationType.PROJECT_ROLE_GRANTED]: ProjectRoleGranted,
    [NotificationType.ADMIN_ADDED]: AdminChange,
    [NotificationType.ADMIN_REMOVED]: AdminChange,
    [NotificationType.HOURS_REJECTED]: HoursRejected,
    [NotificationType.APPROVAL_REQUIRED]: HoursApproval,
    [NotificationType.FREEZE_SUCCESS]: FreezeSuccess,
    [NotificationType.FREEZE_PREPARE]: FreezePrepare,
    [NotificationType.UN_FREEZE]: Unfreeze,
    [NotificationType.FREEZE_ERROR]: FreezeError,
  };
  const component = computed<Component>(
    () => components[type] || NotificationBase
  );

  return component;
};
