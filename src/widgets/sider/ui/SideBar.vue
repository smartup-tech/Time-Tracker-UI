<script lang="ts" setup>
import { FeedbackLink, MainMenu } from '@/widgets';

withDefaults(
  defineProps<{
    collapsed?: boolean;
  }>(),
  {
    collapsed: false,
  }
);
</script>

<template>
  <div :class="['sider', collapsed && 'sider_collapsed']">
    <span class="brand" />
    <MainMenu class="sider__menu" />
    <div class="sider__secondary">
      <FeedbackLink :icon-only="collapsed" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sider {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  height: 100%;
  width: 100%;
  padding: 12px 8px;

  @include respond-to($bp-lg) {
    padding: 12px 0 12px 16px;
  }

  &__menu {
    flex: auto;
  }

  &__secondary {
    flex: 0 auto;
    margin-top: 16px;
    padding: 0 16px;
    transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), color 0.3s;

    .sider_collapsed & {
      padding: 0;
    }
  }
}

.brand {
  display: flex;
  flex: 0 auto;
  height: 44px;
  margin-bottom: 16px;
}
</style>
