<script lang="ts" setup>
import { Card, PageHeader, Button } from 'ant-design-vue';
import { ProductionCalendar } from '@/widgets';
import { useProductionCalendarStore, useAuthStore } from '@/store';
import { computed, onMounted } from 'vue';
import { PageName } from '@/pages/config';

const { canEditProductionCalendar } = useAuthStore();
const { fetchProductionCalendarDays } = useProductionCalendarStore();

onMounted(async () => {
  await fetchProductionCalendarDays();
});

const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
  <PageHeader class="page-header" title="Производственный календарь" />
  <Card
    :bordered="false"
    :headStyle="{ border: 'none' }"
    class="production-calendar-list"
  >
    <template v-if="canEditProductionCalendar" #title>
      <RouterLink
        :to="{ name: PageName.PRODUCTION_CALENDAR_CREATE }"
        custom
        v-slot="{ navigate }"
      >
        <Button type="primary" @click="navigate">Добавить</Button>
      </RouterLink>
    </template>
    <template #extra> {{ currentYear }} г. </template>
    <ProductionCalendar.ProdictionCalendarDisplay />
  </Card>
</template>

<style lang="scss">
.page-header {
  padding-right: 0;
  padding-left: 0;
}

.production-calendar-list .ant-card-body {
  padding-top: 0;
  padding-right: 0;
  padding-left: 0;
}
</style>
