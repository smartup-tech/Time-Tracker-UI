<script lang="ts" setup>
import { Card, PageHeader } from 'ant-design-vue';

import { PageBreadcrumbs } from '@/shared/ui';
import { ProductionCalendar } from '@/widgets';

import { PageName, paths } from '@/pages/config';
import { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useProductionCalendarStore } from '@/store/calendar';
import { computed, onMounted } from 'vue';

const { calendarDays } = storeToRefs(useProductionCalendarStore());
const { fetchProductionCalendarDays } = useProductionCalendarStore();
const router = useRouter();

onMounted(async () => {
  await fetchProductionCalendarDays();
});

const toCalendarDisplay = () => {
  router.push({
    name: PageName.PRODUCTION_CALENDAR
  })
}

const breadcrumbs: Route[] = [
  {
    path: paths[PageName.PRODUCTION_CALENDAR],
    breadcrumbName: 'Производственный календарь',
  },
];

const disableDate = computed(() => calendarDays.value.map(day => day.day))
</script>

<template>
  <PageHeader class="page-header" title="Добавление дня в календарь">
    <template #breadcrumb>
      <PageBreadcrumbs :breadcrumbs="breadcrumbs" />
    </template>
  </PageHeader>
  <Card :bordered="false">
    <ProductionCalendar.AddProductionCalendar
      class="production-calendar-page__form"
      :disabled-dates="disableDate"
      @success="toCalendarDisplay"
      @cancel="toCalendarDisplay"
    />
  </Card>
</template>

<style lang="scss">
.page-header {
  padding-right: 0;
  padding-left: 0;
}

.production-calendar-page {
  &__form {
    max-width: 40%;
  }
}
</style>
