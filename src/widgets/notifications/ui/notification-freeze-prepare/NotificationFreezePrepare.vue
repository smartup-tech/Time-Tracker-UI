<script setup lang="ts">
import dayjs from 'dayjs';

import { NotificationBase } from '../notification-base';

import type { NotificationFreezePrepare } from '@/types';
import { DateFormat } from '@/constants';

const props = defineProps<{
  notification: NotificationFreezePrepare;
}>();

const splitFreezeDate = props.notification.data.date.split(' ');
</script>

<template>
  <NotificationBase
    :notification="{ ...notification, text: 'Блокировка часов' }"
  >
    <template #description>
      Блокировка запланирована на
      {{
        `${dayjs(splitFreezeDate[0], 'DD.MM.YYYY').format(
          DateFormat.DAY_MONTH_YEAR
        )} ${splitFreezeDate[1]} ${splitFreezeDate[2]}`
      }}.
    </template>
  </NotificationBase>
</template>
