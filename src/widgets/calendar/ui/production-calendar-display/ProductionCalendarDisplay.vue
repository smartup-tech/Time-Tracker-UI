<script lang="ts" setup>
import { Table, TableProps, Space } from 'ant-design-vue';
import { DeleteCalendarDay } from '@/features/calendar';
import { storeToRefs } from 'pinia';
import { useAuthStore, useProductionCalendarStore } from '@/store';
import dayjs from 'dayjs';

import { ProductionCalendarDay, calendarDayOptions } from '@/types/calendar';
import { computed } from 'vue';
import { BodyCell } from '@/types';

const { canEditProductionCalendar } = useAuthStore();

const { calendarDays } = storeToRefs(useProductionCalendarStore());

const formatDate = (item: string) => {
  return dayjs(item).format('D MMM YYYY');
};

const dataSoure = computed<TableProps<ProductionCalendarDay>['dataSource']>(
  () => {
    return calendarDays.value;
  }
);

const columns = computed<TableProps['columns']>(() => {
  return [
    {
      key: 'day',
      title: 'Дата',
      dataIndex: 'day',
      customRender: (record) => formatDate(record.value),
    },
    {
      key: 'status',
      title: 'Статус дня',
      dataIndex: 'status',
      customRender: (record) =>
        calendarDayOptions.find((option) => record.value === option.value)
          ?.label,
    },
    {
      key: 'hours',
      title: 'Норма рабочего времени',
      dataIndex: 'hours',
    },
    {
      key: 'action',
      title: '',
      dataIndex: 'action',
      width: 20,
    },
  ];
});
</script>

<template>
  <Table
    item-layout="horizontal"
    :data-source="dataSoure"
    :columns="columns"
    :pagination="false"
  >
    <template #bodyCell="{ column, record }: BodyCell">
      <template v-if="column.key === 'action' && canEditProductionCalendar">
        <Space>
          <DeleteCalendarDay :item="record" />
        </Space>
      </template>
    </template>
  </Table>
</template>

<style lang="scss"></style>
