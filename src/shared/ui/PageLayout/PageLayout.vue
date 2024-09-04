<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Button, Layout } from 'ant-design-vue';
import { breakpointsAntDesign, useBreakpoints } from '@vueuse/core';

import { Header, SideBar } from '@/widgets';
import { useBoolean } from '@/shared/lib';
import { LAIcon } from '@/shared/ui';

const WIDTH = 200;
const COLLAPSED_WIDTH = 64;

const breakpoints = useBreakpoints(breakpointsAntDesign);
const lg = breakpoints.greaterOrEqual('lg');

const [isCollapsed, { toggle, set: setCollapsed }] = useBoolean(false);

const sidebarWidth = computed<string>(() =>
  isCollapsed.value ? `${collapsedWidth.value}px` : `${WIDTH}px`
);

const mainStyle = computed(() => ({
  marginLeft: lg.value ? sidebarWidth.value : 0,
  transition: 'margin 0.3s cubic-bezier(0.2, 0, 0, 1) 0s',
}));

const collapsedWidth = computed<number>(() => (lg.value ? COLLAPSED_WIDTH : 0));

const onBreakpoint = (broken: boolean) => {
  setCollapsed(broken);
};

const route = useRoute();

watch(
  () => route.name,
  () => {
    if (!lg.value) {
      setCollapsed(true);
    }
  }
);
</script>

<template>
  <Layout>
    <Layout.Sider
      class="aside"
      theme="light"
      breakpoint="xl"
      :collapsed="isCollapsed"
      :collapsed-width="collapsedWidth"
      :trigger="null"
      :width="WIDTH"
      @breakpoint="onBreakpoint"
    >
      <SideBar :collapsed="isCollapsed" />
    </Layout.Sider>
    <Layout :style="mainStyle">
      <Header>
        <Button type="text" @click="toggle">
          <template #icon>
            <LAIcon icon="bars" size="large" />
          </template>
        </Button>
      </Header>

      <Layout.Content class="content">
        <RouterView />
      </Layout.Content>
      <div v-if="!lg && !isCollapsed" class="overlay" @click="toggle" />
    </Layout>
  </Layout>
</template>

<style lang="scss" scoped>
.content {
  padding: 0 8px 24px;

  @include respond-to($bp-md) {
    padding: 0 16px 32px;
  }

  @include respond-to($bp-lg) {
    padding: 0 24px 48px;
  }
}

.aside {
  position: fixed;
  z-index: 1001;
  overflow: auto;
  width: 0;
  left: 0;
  top: 0;
  bottom: 0;
  background: white;

  @include respond-to($bp-lg) {
    background: transparent;
  }

  &__close {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}

.overlay {
  position: fixed;
  z-index: 1000;
  overflow: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #000;
  opacity: 0.5;
}
</style>
