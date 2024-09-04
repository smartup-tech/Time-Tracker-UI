<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { Layout, Space } from 'ant-design-vue';

import { useAuthStore } from '@/store';
import { Notifications, ProfileMenu } from '@/widgets';

const authStore = useAuthStore();

const { isAuthenticated } = storeToRefs(authStore);
</script>

<template>
  <Layout.Header class="header">
    <nav class="header__inner">
      <slot />
      <Space size="middle">
        <Notifications />
        <ProfileMenu v-if="isAuthenticated" />
      </Space>
    </nav>
  </Layout.Header>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  padding: 0 8px;
  background: transparent;

  @include respond-to($bp-md) {
    padding: 0 16px;
  }

  @include respond-to($bp-lg) {
    padding: 0 24px;
  }

  &__inner {
    display: flex;
    flex: auto;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
