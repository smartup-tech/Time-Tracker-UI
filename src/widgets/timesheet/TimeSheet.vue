<script lang="ts" setup>
import { computed, onBeforeMount, shallowRef, watch } from 'vue';
import { Button, Card } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { SubmitTimesheet } from '@/features/timesheet';
import { WeekSelect } from '@/shared/ui';
import { useTimesheetStore } from '@/store';

import { TimesheetTable } from './ui';

const props = defineProps<{
  startDate?: string;
  uid?: number;
}>();

const emit = defineEmits(['reset']);

const { editableRow, hasUnsubmittedHours, timesheetRows, weekStart, weekdays } =
  storeToRefs(useTimesheetStore());
const {
  fetchTimesheet,
  fetchProjects,
  fetchUnsubmittedHours,
  getTimesheetRowIndex,
  insertTimesheetEntry,
  refreshTimesheet,
  setActiveDay,
  setEditable,
  setWeekStart,
} = useTimesheetStore();

// eslint-disable-next-line vue/no-dupe-keys
const startDate = computed<string>({
  get: () => weekStart.value,
  set: (value: string) => setWeekStart(value),
});

const allDaysBlocked = computed<boolean>(() =>
  weekdays.value.every((day) => day.blocked)
);

const addedRow = shallowRef(false);

const addRow = () => {
  if (!addedRow.value) {
    insertTimesheetEntry();
    setEditable(0);
    addedRow.value = true;
  }
};

const activateUnitTrack = (uid: number) => {
  const entry = timesheetRows.value.find(
    (row) => Object.values(row.units).findIndex((unit) => uid === unit.id) >= 0
  );

  if (entry?.projectId && entry.taskId) {
    const rowIndex = getTimesheetRowIndex(entry.projectId, entry.taskId);
    const unit = Object.values(entry.units).find((unit) => uid === unit.id);

    setActiveDay(unit?.workDay || weekStart.value);
    setEditable(rowIndex);
  }
};

onBeforeMount(async () => {
  if (props.startDate) {
    setWeekStart(props.startDate);
  }

  await Promise.all([
    fetchProjects(),
    fetchTimesheet(),
    fetchUnsubmittedHours(),
  ]);

  if (props.uid) {
    activateUnitTrack(props.uid);
  }
});

watch(startDate, () => {
  setEditable(null);
  addedRow.value = false;
  fetchTimesheet();
});

watch(editableRow, (newValue) => {
  if (newValue === null) {
    emit('reset');
  }
});

watch(
  () => props,
  async (newProps) => {
    const { startDate, uid } = newProps;

    if (startDate && startDate !== weekStart.value) {
      setWeekStart(startDate);
      await fetchTimesheet();
    }

    if (uid) {
      activateUnitTrack(uid);
    }
  },
  { deep: true }
);
</script>

<template>
  <Card :bordered="false" :headStyle="{ border: 'none' }">
    <template #title>
      <Button :disabled="allDaysBlocked" type="primary" @click="addRow">
        Добавить
      </Button>
    </template>

    <template #extra>
      <WeekSelect v-model:value="startDate" />
    </template>

    <TimesheetTable
      @save="(editableRow) => (addedRow = !(editableRow === 0))"
      @cancel="(editableRow) => (addedRow = !(editableRow === 0))"
      @delete="(editableRow) => (addedRow = !(editableRow === 0))"
      @focusRow="addedRow = false"
    />
  </Card>

  <SubmitTimesheet v-if="hasUnsubmittedHours" @success="refreshTimesheet" />
</template>

<style lang="scss" scoped>
:deep(.ant-card-head) {
  padding-left: 16px;
  padding-right: 16px;
}

:deep(.ant-card-body) {
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
}
</style>
