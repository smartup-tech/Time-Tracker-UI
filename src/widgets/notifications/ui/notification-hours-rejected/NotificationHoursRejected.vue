<script setup lang="ts">
import { DateFormat } from '@/constants';
import { LAIcon } from '@/shared/ui';
import { formatTimestampDate } from '@/shared/lib';

import { NotificationBase } from '../notification-base';

import type { NotificationHoursRejected } from '@/types';

defineProps<{
  notification: NotificationHoursRejected;
}>();
</script>

<template>
  <NotificationBase
    :notification="{ ...notification, text: 'Время не согласовано' }"
  >
    <template #icon>
      <LAIcon icon="times-circle" size="large" />
    </template>
    <template #description>
      Время за период
      {{
        formatTimestampDate(
          notification.data.startOfPeriodHasRejection,
          DateFormat.DAY_MONTH
        )
      }}
      -
      {{
        formatTimestampDate(
          notification.data.endOfPeriodHasRejection,
          DateFormat.DAY_MONTH
        )
      }}
      не согласовано.
    </template>
  </NotificationBase>
</template>

<style lang="scss" scoped>
:deep(.unit-date) {
  font-size: 12px;
  margin-right: 4px;
  color: var(--color-text-muted);
}
</style>
