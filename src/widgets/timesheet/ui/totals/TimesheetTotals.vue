<script lang="ts" setup>
import { computed } from 'vue';

import TimesheetCell from '../cell/TimesheetCell.vue';
import { addToSum, formatHours } from '@/shared/lib';
import { getTotalRowHours } from '../../lib';

import type { ITimesheetRow } from '@/types';
import type { TimesheetColumn } from '../../types';

type Props = {
  columns: TimesheetColumn[];
  rows: ITimesheetRow[];
};

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  rows: () => [],
});

const dayColumns = computed(() =>
  props.columns?.filter((column) => 'days' === column.dataIndex)
);

const getDayTotal = (day: string) =>
  props.rows
    .map((row: ITimesheetRow) => row.units[day].hours)
    .reduce(addToSum, 0);

const getWeekTotal = (): number =>
  props.rows.map(getTotalRowHours).reduce(addToSum, 0);
</script>

<template>
  <tfoot class="timesheet-table__foot">
    <tr>
      <TimesheetCell class="timesheet-table__foot-cell" :colspan="2">
        Всего
      </TimesheetCell>

      <TimesheetCell
        v-for="column in dayColumns"
        :key="column.key"
        class="timesheet-table__foot-cell timesheet-table__foot-cell_day-total"
      >
        {{ formatHours(getDayTotal(column.key)) }}
      </TimesheetCell>
      <TimesheetCell
        class="timesheet-table__foot-cell timesheet-table__foot-cell_week-total"
      >
        {{ formatHours(getWeekTotal()) }}
      </TimesheetCell>
    </tr>
  </tfoot>
</template>

<style lang="scss" scoped>
.timesheet-table {
  &__foot {
    height: 32px;
  }

  &__foot-cell {
    background: #fafafa;
  }

  &__foot-cell_day-total {
    text-align: center;
  }

  &__foot-cell_week-total {
    text-align: right;
  }
}
</style>
