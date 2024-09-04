<script lang="ts" setup>
import { Breadcrumb } from 'ant-design-vue';

import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';

defineProps<{
  breadcrumbs: Route[];
}>();
</script>

<template>
  <Breadcrumb :routes="breadcrumbs">
    <template #itemRender="{ route }">
      <RouterLink :to="route.path">
        {{ route.breadcrumbName }}
      </RouterLink>
    </template>
  </Breadcrumb>
</template>

<style lang="scss" scoped>
.ant-breadcrumb a,
.ant-breadcrumb > span:last-child a {
  color: rgba(0, 0, 0, 0.65);

  &:hover {
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>
