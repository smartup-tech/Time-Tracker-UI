<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { PageName } from '@/pages';
import { getFullName } from '@/shared/lib';
import { LAIcon } from '@/shared/ui';
import { useAuthStore } from '@/store';

import { NotificationBase } from '../notification-base';

import type { NotificationAdminChange } from '@/types';

defineProps<{
  notification: NotificationAdminChange;
}>();

const { hasAdminRole } = storeToRefs(useAuthStore());
</script>

<template>
  <NotificationBase :notification="notification">
    <template #icon>
      <LAIcon icon="user-shield" size="large" />
    </template>
    <template #description>
      <RouterLink
        v-if="hasAdminRole"
        :to="{
          name: PageName.USER_EDIT,
          params: {
            userId: notification.data.user.id,
          },
        }"
      >
        {{ getFullName(notification.data.user) }}
      </RouterLink>
      <template v-else>
        {{ getFullName(notification.data.user) }}
      </template>
    </template>
  </NotificationBase>
</template>
