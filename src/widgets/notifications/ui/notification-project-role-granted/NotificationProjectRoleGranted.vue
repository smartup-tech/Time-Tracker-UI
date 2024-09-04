<script setup lang="ts">
import { LAIcon } from '@/shared/ui';

import { NotificationBase } from '../notification-base';

import type { NotificationProjectRoleChange } from '@/types';

defineProps<{
  notification: NotificationProjectRoleChange;
}>();
</script>

<template>
  <NotificationBase :notification="notification">
    <template #icon>
      <LAIcon icon="bookmark" size="large" />
    </template>
    <template #description>
      {{ notification.data.project.name }}
    </template>
  </NotificationBase>
</template>
