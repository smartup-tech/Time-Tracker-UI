<script lang="ts" setup>
import { formatHours } from '@/shared/lib';
import { LAIcon } from '@/shared/ui';
import { useTimesheetStore } from '@/store';

import { TimesheetCell } from '../cell';
import { getTotalRowHours, isLockedUnit } from '../../lib';

import { type ITimesheetRow } from '@/types';
import { calendarDayOptions } from '@/types/calendar';
import type { TimesheetColumn } from '../../types';

type Props = {
  columns: TimesheetColumn[];
  model: ITimesheetRow;
};

const props = defineProps<Props>();

const emit = defineEmits(['cellClick']);

const { isBlockedDate, getByDate } = useTimesheetStore();

const onCellClick = (column: TimesheetColumn) => emit('cellClick', column);

const isLockedCell = (column: TimesheetColumn) =>
  isBlockedDate(column.key) || isLockedUnit(props.model.units[column.key]);

const getDateBackgroundColor = (column: TimesheetColumn): string => {
  const date = getByDate(column.key);
  if (!date) {
    return '';
  }
  if (props.model.units[column.key].hours > date.standardHours) {
    return 'bg-cell__irregular';
  }
  return (
    calendarDayOptions.find((option) => option.value === date.status)?.style ??
    ''
  );
};
</script>

<template>
  <tr :class="['timesheet-table__row', 'timesheet-table__row_viewer']">
    <TimesheetCell
      v-for="column in columns"
      :key="column.key"
      :hover="column.key !== 'total'"
      :class="[
        column.class,
        column.dataIndex === 'days' ? getDateBackgroundColor(column) : '',
      ]"
      @click="onCellClick(column)"
    >
      <template v-if="column.key === 'project'">
        {{ model.projectName }}
      </template>
      <template v-else-if="column.key === 'task'">
        {{ model.taskName }}
      </template>
      <template v-else-if="column.dataIndex === 'days'">
        <span
          :class="[
            'timesheet-table__hours',
            isLockedCell(column) && 'timesheet-table__hours_locked',
          ]"
        >
          <LAIcon
            v-if="model.units[column.key].rejected"
            class="timesheet-table__rejected-icon"
            icon="exclamation-triangle"
            size="small"
          />
          <LAIcon
            v-if="isLockedCell(column)"
            class="timesheet-table__lock-icon"
            icon="lock"
            size="small"
          />
          {{ formatHours(model.units[column.key].hours) }}
        </span>
      </template>
      <template v-else-if="column.key === 'total'">
        {{ formatHours(getTotalRowHours(model)) }}
      </template>
    </TimesheetCell>
  </tr>
</template>

<style lang="scss" scoped>
@import '/src/app/styles/index';
.timesheet-table__row_viewer {
  height: 40px;
}

.timesheet-table__hours {
  &_locked {
    color: #7f7f7f;
  }
}

.timesheet-table__lock-icon {
  font-size: 1em;
}

.timesheet-table__rejected-icon {
  font-size: 1em;
  color: var(--color-warning);
}
</style>
