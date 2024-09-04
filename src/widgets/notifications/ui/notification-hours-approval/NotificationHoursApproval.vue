<script setup lang="ts">
import { computed } from 'vue';
import { Button } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';

import { PageName } from '@/pages';
import { getPluralHours } from '@/shared/lib';
import { LAIcon } from '@/shared/ui';
import { useAuthStore } from '@/store';

import { NotificationBase } from '../notification-base';

import type { NotificationApprovalRequired } from '@/types';

const props = defineProps<{
  notification: NotificationApprovalRequired;
}>();

const emit = defineEmits(['markRead']);

const route = useRoute();
const router = useRouter();

const { canApproveTimesheets } = storeToRefs(useAuthStore());

const totalHours = computed<number>(
  () => props.notification.data.usersHours.sumHours
);

const navigateToApproval = () => {
  router.push({
    name: PageName.TIMESHEET_APPROVAL,
    force: true,
    replace: route.name === PageName.TIMESHEET_APPROVAL,
  });
  emit('markRead');
};
</script>

<template>
  <NotificationBase
    :notification="{ ...notification, text: 'Требуется согласование' }"
    @mark-read="emit('markRead')"
  >
    <template #icon>
      <LAIcon icon="check-circle" size="large" />
    </template>
    <template #description> Всего {{ getPluralHours(totalHours) }} </template>
    <template v-if="canApproveTimesheets" #extra>
      <Button type="primary" size="small" @click="navigateToApproval">
        Перейти
      </Button>
    </template>
  </NotificationBase>
</template>
