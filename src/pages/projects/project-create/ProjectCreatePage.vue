<script setup lang="ts">
import { PageHeader } from 'ant-design-vue';
import { useRouter } from 'vue-router';

import { PageName } from '@/pages';

import { CreateProject } from '@/features/projects';
import { PageBreadcrumbs } from '@/shared/ui';

import { projectsBreadcrumbs } from '../config';

const router = useRouter();

const goToProjectList = () =>
  router.push({
    name: PageName.PROJECTS,
  });
</script>

<template>
  <PageHeader class="page-header" title="Новый проект">
    <template #breadcrumb>
      <PageBreadcrumbs :breadcrumbs="projectsBreadcrumbs" />
    </template>
  </PageHeader>

  <CreateProject @cancel="goToProjectList" @success="goToProjectList" />
</template>
