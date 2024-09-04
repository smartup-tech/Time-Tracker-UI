<script setup lang="ts">
import { LAIcon } from '@/shared/ui';
import dayjs from 'dayjs';

import { NotificationBase } from '../notification-base';

import type { NotificationFreeze } from '@/types';
import { DateFormat } from '@/constants';

defineProps<{
  notification: NotificationFreeze;
}>();
</script>

<template>
  <NotificationBase
    :notification="{ ...notification, text: 'Блокировка завершена' }"
  >
    <template #icon>
      <LAIcon icon="check-circle" size="large" />
    </template>
    <template #description>
      Часы заморожены по
      {{ dayjs(notification.data.date).format(DateFormat.DAY_MONTH_YEAR) }}
      включительно.
    </template>
  </NotificationBase>
</template>
