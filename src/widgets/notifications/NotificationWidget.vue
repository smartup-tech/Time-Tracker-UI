<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Badge, Button, Popover, Space, TypographyTitle } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { useIntervalFn } from '@vueuse/shared';
import { breakpointsAntDesign, useBreakpoints } from '@vueuse/core';

import { useBoolean } from '@/shared/lib';
import { LAIcon } from '@/shared/ui';
import { useAuthStore, useNotificationsStore } from '@/store';

import { POLLING_INTERVAL } from './config';
import { NotificationList } from './ui';

const route = useRoute();

const breakpoints = useBreakpoints(breakpointsAntDesign);
const sm = breakpoints.greaterOrEqual('sm');

const { canApproveTimesheets } = storeToRefs(useAuthStore());

const { fetchUnreadCount, markAllNotificationsRead } = useNotificationsStore();
const { hasNewNotifications } = storeToRefs(useNotificationsStore());

const [menuVisible, { set: setMenuVisible }] = useBoolean(false);
const [
  shouldDisplaySettings,
  { setTrue: showSettings, setFalse: hideSettings },
] = useBoolean(false);

const title = computed<string>(() =>
  shouldDisplaySettings.value ? 'Настройки' : 'Уведомления'
);

const onVisibleChange = (isVisible: boolean) => {
  setMenuVisible(isVisible);

  if (!isVisible) {
    hideSettings();
  }
};

useIntervalFn(fetchUnreadCount, POLLING_INTERVAL, {
  immediate: true,
  immediateCallback: true,
});

watch(
  () => route,
  () => setMenuVisible(false),
  { deep: true }
);
</script>

<template>
  <Popover
    class="notifications"
    placement="bottomRight"
    trigger="click"
    overlay-class-name="notifications__popover"
    destroy-tooltip-on-hide
    :visible="menuVisible"
    @visible-change="onVisibleChange"
  >
    <Button shape="circle" type="text">
      <template #icon>
        <Badge :dot="hasNewNotifications" color="var(--color-primary)">
          <LAIcon icon="bell" size="large" />
        </Badge>
      </template>
    </Button>
    <template #title>
      <div class="notifications__header">
        <TypographyTitle class="notifications__title" :level="4">
          {{ title }}
        </TypographyTitle>

        <Button
          v-if="shouldDisplaySettings"
          shape="circle"
          type="text"
          @click="hideSettings"
        >
          <template #icon>
            <LAIcon icon="times" />
          </template>
        </Button>
        <Space v-else class="notifications__actions">
          <Button
            v-if="hasNewNotifications"
            :type="sm ? 'link' : 'text'"
            :shape="sm ? 'default' : 'circle'"
            :size="sm ? 'small' : 'middle'"
            @click="markAllNotificationsRead"
          >
            <template #icon>
              <LAIcon icon="check-double" />
            </template>
            <span v-if="sm">Прочитать всё</span>
          </Button>

          <Button
            v-if="canApproveTimesheets"
            shape="circle"
            type="text"
            @click="showSettings"
          >
            <template #icon>
              <LAIcon icon="cog" />
            </template>
          </Button>
        </Space>
      </div>
    </template>
    <template #content>
      <NotificationList class="notifications__list" />
    </template>
  </Popover>
</template>

<style lang="scss" scoped>
.notifications {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
  }

  &__list {
    width: 300px;
    margin: -12px -16px;
    border-radius: 0 0 4px 4px;
    overflow: hidden;

    @include respond-to($bp-sm) {
      width: 380px;
    }
  }

  &__settings {
    width: 268px;

    @include respond-to($bp-sm) {
      width: 348px;
    }
  }

  &__title {
    font-size: 16px;
    margin: 0;

    @include respond-to($bp-sm) {
      padding: 0 8px;
    }
  }
}
</style>
