<script lang="ts" setup>
import { PageHeader } from 'ant-design-vue';

import { Reports } from '@/widgets';
import { PageBreadcrumbs } from '@/shared/ui';

import { reportsBreadcrumbs } from '../config';
</script>

<template>
  <PageHeader class="header" title="Отчет о времени по сотрудникам">
    <template #breadcrumb>
      <PageBreadcrumbs :breadcrumbs="reportsBreadcrumbs" />
    </template>
  </PageHeader>

  <Reports.HoursPerUserReport />
</template>
