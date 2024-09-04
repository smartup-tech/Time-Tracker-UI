<script setup lang="ts">
import TimesheetCell from '@/widgets/timesheet/ui/cell/TimesheetCell.vue';

import { TimesheetColumn } from '@/widgets/timesheet';
import { ApprovalDayRow, ApprovalDayNestedRow } from '@/types';

import { calendarDayOptions } from '@/types/calendar';
import { useApprovalDaysStore } from '@/store';

type Props = {
  columns: TimesheetColumn[];
  data: ApprovalDayRow | ApprovalDayNestedRow;
  isStart?: boolean;
  isEnd?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  isStart: true,
  isEnd: false,
});

const { getByDate } = useApprovalDaysStore();

const getBackgroundCell = (column: TimesheetColumn) => {
  const calendarDay = getByDate(column.dataIndex);

  if (!calendarDay) {
    return '';
  }
  if (Number(props.data[column.dataIndex]) > calendarDay.standardHours) {
    return 'bg-cell__irregular';
  }
  return (
    calendarDayOptions.find((option) => option.value === calendarDay?.status)
      ?.style ?? ''
  );
};

const getCellStyle = (column: TimesheetColumn, index: number): string[] => {
  const styles: string[] = [];
  if (index === 0 && !props.isStart) {
    styles.push('timesheet-table__cell-first');
  }
  if (index === props.columns.length - 1 && !props.isEnd) {
    styles.push('timesheet-table__cell-last');
  }
  styles.push(getBackgroundCell(column));
  return styles;
};
</script>

<template>
  <tr>
    <TimesheetCell
      v-for="(column, index) in columns"
      :key="column.key"
      :class="getCellStyle(column, index)"
    >
      <slot name="bodyCell" :column="column">
        {{ data[column.dataIndex] }}
      </slot>
    </TimesheetCell>
  </tr>
</template>
