<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Button, PageHeader } from 'ant-design-vue';

import { useAuthStore } from '@/store';
import { PageName } from '@/pages';
import { Projects } from '@/widgets';

const { canCreateProjects } = storeToRefs(useAuthStore());
</script>

<template>
  <PageHeader class="page-header" title="Проекты">
    <template #extra>
      <RouterLink
        v-if="canCreateProjects"
        :to="{ name: PageName.PROJECT_CREATE }"
        custom
        v-slot="{ navigate }"
      >
        <Button type="primary" @click="navigate">Добавить</Button>
      </RouterLink>
    </template>
  </PageHeader>
  <Projects.ProjectsList />
</template>

<style lang="scss" scoped>
.page-header {
  padding-right: 0;
  padding-left: 0;
}
</style>
