<script setup lang="ts">
import { computed } from 'vue';

import { arrowSeparated } from '@/shared/lib';
import { LAIcon } from '@/shared/ui';

import { NotificationBase } from '../notification-base';

import type { NotificationProjectUpdate } from '@/types';

const props = defineProps<{
  notification: NotificationProjectUpdate;
}>();

const description = computed<string>(() =>
  Object.keys(props.notification.data.changes)
    .map((field: string) =>
      arrowSeparated(
        props.notification.data.changes[field].oldValue,
        props.notification.data.changes[field].newValue
      )
    )
    .join(', ')
);
</script>

<template>
  <NotificationBase :notification="notification">
    <template #icon>
      <LAIcon icon="pen" size="large" />
    </template>
    <template #description>
      {{ description }}
    </template>
  </NotificationBase>
</template>
