<script lang="ts" setup>
import { ref, watch } from 'vue';
import { RouteLocation, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { Menu } from 'ant-design-vue';

import { PageName } from '@/pages';
import { useAuthStore } from '@/store';
import { LAIcon } from '@/shared/ui';

const route = useRoute();
const {
  canApproveTimesheets,
  canViewPositions,
  canViewProjects,
  canViewTimeFreeze,
  canViewTracker,
  canViewCalendar,
  canViewUsers,
} = storeToRefs(useAuthStore());

const getRouteSlices = (path: RouteLocation) => {
  const routes = path.matched[path.matched.length - 1].path
    .split('/')
    .filter((item: string) => item);
  return [routes.length ? routes[0] : ''];
};

const current = ref<string[]>(getRouteSlices(route));

watch(
  () => route.name,
  () => (current.value = getRouteSlices(route))
);
</script>

<template>
  <Menu class="menu" mode="vertical" :selected-keys="current">
    <Menu.Item v-if="canViewTracker" :key="PageName.TRACKER">
      <template #icon>
        <LAIcon icon="business-time" size="large" />
      </template>
      <RouterLink :to="{ name: PageName.TRACKER }">Трекер</RouterLink>
    </Menu.Item>
    <Menu.Item v-if="canViewProjects" :key="PageName.PROJECTS">
      <template #icon>
        <LAIcon icon="boxes" size="large" />
      </template>
      <RouterLink :to="{ name: PageName.PROJECTS }">Проекты</RouterLink>
    </Menu.Item>
    <Menu.Item v-if="canViewPositions" :key="PageName.POSITION_LIST">
      <template #icon>
        <LAIcon icon="user-tag" size="large" />
      </template>
      <RouterLink :to="{ name: PageName.POSITION_LIST }">Должности</RouterLink>
    </Menu.Item>
    <Menu.Item v-if="canViewUsers" :key="PageName.USERS">
      <template #icon>
        <LAIcon icon="users" size="large" />
      </template>
      <RouterLink :to="{ name: PageName.USERS }">Сотрудники</RouterLink>
    </Menu.Item>
    <Menu.Item :key="PageName.REPORTS">
      <template #icon>
        <LAIcon icon="table" size="large" />
      </template>
      <RouterLink :to="{ name: PageName.REPORTS }">Отчеты</RouterLink>
    </Menu.Item>
    <Menu.Item v-if="canApproveTimesheets" :key="PageName.TIMESHEET_APPROVAL">
      <template #icon>
        <LAIcon icon="check-square" size="large" />
      </template>
      <RouterLink :to="{ name: PageName.TIMESHEET_APPROVAL }">
        Согласование часов
      </RouterLink>
    </Menu.Item>
    <Menu.Item v-if="canViewTimeFreeze" :key="PageName.TIME_FREEZE">
      <template #icon>
        <LAIcon icon="lock" size="large" />
      </template>
      <RouterLink :to="{ name: PageName.TIME_FREEZE }">Блокировка</RouterLink>
    </Menu.Item>
    <Menu.Item v-if="canViewCalendar" :key="PageName.PRODUCTION_CALENDAR">
      <template #icon>
        <LAIcon icon="calendar" size="large" />
      </template>
      <RouterLink :to="{ name: PageName.PRODUCTION_CALENDAR }">Производственный календарь</RouterLink>
    </Menu.Item>
  </Menu>
</template>

<style lang="scss" scoped>
.menu {
  width: 100%;
  border: none;
  background: transparent;

  &__icon {
    width: 18px;
    height: 18px;
  }
}

:deep(.ant-menu-item) {
  border-radius: 8px;
  display: flex;
  align-items: center;
  white-space: normal;
  line-height: 1.3;

  &,
  &:active {
    color: rgba(0, 0, 0, 0.85);

    &,
    & a,
    &:hover {
      color: rgba(0, 0, 0, 0.85);
    }
  }

  &:active,
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .ant-menu.ant-menu-inline-collapsed & {
    padding: 0 12px;
  }
}

:deep(.ant-menu-item-selected) {
  font-weight: 500;

  :not(.ant-menu-horizontal) & {
    background-color: rgba(0, 0, 0, 0.08);
  }

  &,
  &:hover {
    color: rgba(0, 0, 0, 0.85);

    a {
      color: rgba(0, 0, 0, 0.85);
    }
  }
}

:deep(.ant-menu-item-icon) {
  min-width: 24px;

  &,
  .ant-menu.ant-menu-inline-collapsed & {
    font-size: 24px;
  }
}
</style>
