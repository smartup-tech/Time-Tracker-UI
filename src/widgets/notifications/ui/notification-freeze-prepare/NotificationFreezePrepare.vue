<script setup lang="ts">
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
    :notification="{ ...notification, text: 'Блокировка часов' }"
  >
    <template #description>
      Блокировка запланирована на
      {{ dayjs(notification.data.date).format(DateFormat.DAY_MONTH_YEAR) }}.
    </template>
  </NotificationBase>
</template>
