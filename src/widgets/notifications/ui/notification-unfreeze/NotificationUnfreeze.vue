<script setup lang="ts">
import dayjs from 'dayjs';

import { NotificationBase } from '../notification-base';

import type { NotificationUnfreeze } from '@/types';
import { DateFormat } from '@/constants';

const props = defineProps<{
  notification: NotificationUnfreeze;
}>();

const splitFreezeDate = props.notification.data.freezeDate.split(' ');
</script>

<template>
  <NotificationBase
    :notification="{ ...notification, text: 'Снятие блокировки' }"
  >
    <template #description>
      Блокировка с 
      {{ dayjs(notification.data.unfreezeRecordDate).format(DateFormat.DAY_MONTH_YEAR) }} 
      временно снята до {{ `${dayjs(splitFreezeDate[0], "DD.MM.YYYY").format(DateFormat.DAY_MONTH_YEAR)} ${splitFreezeDate[1]} ${splitFreezeDate[2]}` }}.
    </template>
  </NotificationBase>
</template>
