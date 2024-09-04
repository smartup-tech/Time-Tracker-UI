<script setup lang="ts">
import { computed } from 'vue';

import { teamRoles } from '@/constants';
import { arrowSeparated } from '@/shared/lib';
import { LAIcon } from '@/shared/ui';

import { NotificationBase } from '../notification-base';

import type { NotificationProjectRoleChange } from '@/types';

const props = defineProps<{
  notification: NotificationProjectRoleChange;
}>();

const title = computed<string>(
  () =>
    `Ваша роль на проекте «${props.notification.data.project.name}» изменилась`
);

const description = computed<string | undefined>(() => {
  const oldValue = props.notification.data?.changes?.projectRole?.oldValue;
  const newValue = props.notification.data?.changes?.projectRole?.newValue;

  return oldValue && newValue
    ? arrowSeparated(teamRoles[oldValue], teamRoles[newValue])
    : undefined;
});
</script>

<template>
  <NotificationBase :notification="{ ...notification, text: title }">
    <template #icon>
      <LAIcon icon="user-tag" size="large" />
    </template>
    <template #description>
      {{ description }}
    </template>
  </NotificationBase>
</template>
