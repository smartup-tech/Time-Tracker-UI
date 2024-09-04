<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { List, Skeleton } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { ScrollShadow } from '@/shared/ui';
import { useNotificationsStore } from '@/store';

import { NotificationItem } from '..';

const { fetchNotifications, deleteNotification, markNotificationRead } =
  useNotificationsStore();
const { isLoading, notifications } = storeToRefs(useNotificationsStore());

onBeforeMount(async () => {
  await fetchNotifications();
});
</script>

<template>
  <ScrollShadow>
    <Skeleton
      active
      :avatar="{ size: 'small' }"
      :loading="isLoading"
      :title="false"
    >
      <List
        class="notifications-list"
        :loading="isLoading"
        :locale="{
          emptyText: 'Нет уведомлений',
        }"
      >
        <NotificationItem
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
          @mark-read="markNotificationRead"
          @delete="deleteNotification"
        />
      </List>
    </Skeleton>
  </ScrollShadow>
</template>

<style lang="scss" scoped>
.notifications-list {
  max-height: 80vh;
  padding: 12px;

  @media screen and (min-height: 800px) {
    max-height: 720px;
  }
}
:deep(.ant-skeleton) {
  padding: 24px 16px 16px 24px;
}
</style>
