<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { List, Popover } from 'ant-design-vue';
import { RouteLocationNamedRaw, useRoute } from 'vue-router';

import { PageName } from '@/pages';
import { getFullName, useBoolean } from '@/shared/lib';
import { LAIcon, UserIcon } from '@/shared/ui';
import { useAuthStore } from '@/store';

type ProfileMenuItem = {
  icon: string;
  route: RouteLocationNamedRaw;
  text: string;
};

const route = useRoute();

const { profile } = storeToRefs(useAuthStore());

const [menuVisible, { set: setMenuVisible, setFalse: hideMenu }] =
  useBoolean(false);

const menuItems: ProfileMenuItem[] = reactive([
  {
    route: {
      name: PageName.PROFILE,
    },
    icon: 'user',
    text: 'Профиль',
  },
  {
    route: {
      name: PageName.LOGOUT,
    },
    icon: 'sign-out-alt',
    text: 'Выйти',
  },
]);

watch(
  () => route.name,
  () => hideMenu()
);
</script>

<template>
  <div class="profile-menu">
    <div class="profile-menu__inner">
      <Popover
        placement="bottomRight"
        trigger="click"
        :visible="menuVisible"
        @visible-change="setMenuVisible"
      >
        <UserIcon class="profile-menu__avatar" :profile="profile" :size="44" />
        <template #title>
          <div class="profile-menu__header">
            <UserIcon
              class="profile-menu__avatar"
              :profile="profile"
              :size="44"
            />
            <div class="profile-menu__meta">
              <div class="profile-menu__username">{{
                getFullName(profile)
              }}</div>
              <div class="profile-menu__email">{{ profile?.email }}</div>
            </div>
          </div>
        </template>
        <template #content>
          <List
            class="profile-menu__menu"
            mode="vertical"
            size="small"
            :split="false"
          >
            <List.Item v-for="item in menuItems" :key="item.route.name">
              <RouterLink
                class="profile-menu__link"
                :to="item.route"
                @click="hideMenu"
              >
                <LAIcon class="profile-menu__icon" :icon="item.icon" />
                {{ item.text }}
              </RouterLink>
            </List.Item>
          </List>
        </template>
      </Popover>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-menu {
  &__avatar {
    flex: 0 0 auto;
    cursor: pointer;
  }

  &__inner {
    display: flex;
    align-items: center;
  }

  &__header {
    display: flex;
    align-items: center;
    padding: 8px 16px 8px 0;
  }

  &__email {
    color: rgba(0, 0, 0, 0.45);
  }

  &__username {
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__link {
    display: flex;
    flex: auto;
    align-items: center;
    line-height: normal;
    padding: 8px;
    border-radius: 4px;
    color: var(--color-text-default);

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }

  &__meta {
    flex: auto;
    margin-left: 12px;
    max-width: 200px;
    white-space: nowrap;

    @include respond-to($bp-xs) {
      max-width: 320px;
    }
  }

  &__menu {
    margin: -8px -12px;
  }

  &__icon {
    margin-right: 8px;
  }
}

:deep(.ant-list-item) {
  padding: 4px;
}
</style>
