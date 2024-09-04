<script lang="ts" setup>
import { Card, List, PageHeader } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { PageName } from '@/pages';
import { useAuthStore } from '@/store';

const { canViewReports, hasReportViewRole } = storeToRefs(useAuthStore());
</script>

<template>
  <PageHeader class="header" title="Отчеты" />

  <Card>
    <List>
      <template v-if="canViewReports">
        <List.Item>
          <RouterLink :to="{ name: PageName.HOURS_PER_USER_REPORT }">
            Отчет о времени по сотрудникам
          </RouterLink>
        </List.Item>
        <List.Item>
          <RouterLink :to="{ name: PageName.HOURS_PER_PROJECT_REPORT }">
            Отчет о времени по проектам
          </RouterLink>
        </List.Item>
      </template>
      <List.Item v-if="!hasReportViewRole">
        <RouterLink :to="{ name: PageName.PERSONAL_HOURS_REPORT }">
          Персональный отчет о затраченном времени
        </RouterLink>
      </List.Item>
    </List>
  </Card>
</template>
