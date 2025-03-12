<script lang="ts" setup>
import { computed } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { Button, Calendar, Form } from 'ant-design-vue';
import { SelectInfo } from 'ant-design-vue/lib/calendar/generateCalendar';
import { useTimeFreezeStore } from '@/store';
import { storeToRefs } from 'pinia';
import intersection from 'lodash/intersection';
import without from 'lodash/without';

type Props = {
  disableAfter?: Dayjs;
  disableBefore?: Dayjs;
  freezeRecords: string[];
  selectedDates: string[];
  inclusive?: boolean;
  scheduled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  inclusive: false,
  scheduled: true,
});

const { lastFreeze } = storeToRefs(useTimeFreezeStore());

const emit = defineEmits([
  'submit-plan-freeze',
  'submit-plan-unfreeze',
  'update:freezeRecords',
  'update:selectedDates',
]);

const isDisabledDate = (currentDate: Dayjs) =>
  (props.disableBefore
    ? currentDate.isBefore(props.disableBefore, 'day')
    : false) ||
  (props.inclusive && props.disableBefore
    ? currentDate.isSame(props.disableBefore, 'day')
    : false) ||
  (lastFreeze.value
    ? currentDate.isBefore(dayjs(lastFreeze.value?.freezeDate), 'day') ||
      currentDate.isSame(dayjs(lastFreeze.value?.freezeDate), 'day')
    : false) ||
  (props.disableAfter ? currentDate.isAfter(props.disableAfter, 'day') : false);

const label = computed<string>(() =>
  props.inclusive ? 'Блокировать часы по (включительно)' : 'Блокировать часы до'
);

const submitFreezeText = computed<string>(() =>
  props.scheduled ? 'Запланировать блокировку' : 'Заблокировать'
);

const submitUnfreezeText = computed<string>(() =>
  props.scheduled ? 'Отменить запланированную блокировку' : 'Разблокировать'
);

const isDisabledFreeze = computed<boolean>(
  () =>
    props.selectedDates.length == 0 ||
    without(props.selectedDates, ...props.freezeRecords).length == 0
);

const isDisabledUnfreeze = computed<boolean>(
  () =>
    props.selectedDates.length == 0 ||
    intersection(props.selectedDates, props.freezeRecords).length == 0
);

const addSelectedDate = (date: Dayjs) => {
  const selectedDates = [...props.selectedDates];
  selectedDates.push(date.toISODate());
  emit('update:selectedDates', selectedDates);
};

const deleteSelectedDate = (index: number) => {
  const selectedDates = [...props.selectedDates];
  selectedDates.splice(index, 1);
  emit('update:selectedDates', selectedDates);
};

const handleSelect = (selectedDate: Dayjs, info: SelectInfo) => {
  /**
   * Only process select event from direct clicks on the dates.
   * Skip events from changes in month/year dropdown
   */
  if (info.source !== 'date') {
    return;
  }

  const index = props.selectedDates.findIndex(
    (alreadySelectedDate) => alreadySelectedDate === selectedDate.toISODate()
  );
  if (index !== -1) {
    deleteSelectedDate(index);
  } else {
    addSelectedDate(selectedDate);
  }
};
</script>

<template>
  <Form layout="vertical" @submit.prevent="">
    <Form.Item :label="label">
      <Calendar
        :fullscreen="false"
        :disabledDate="isDisabledDate"
        @select="handleSelect"
      >
        <template #dateCellRender="{ current }">
          <div
            :class="{
              'bg-cell': true,
              'freeze-cell': props.freezeRecords.includes(current.toISODate()),
              'selected-cell': props.selectedDates.includes(
                current.toISODate()
              ),
            }"
            >{{ current.format('DD') }}</div
          >
        </template>
      </Calendar>
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        type="primary"
        :disabled="isDisabledFreeze"
        @click="emit('submit-plan-freeze', freezeRecords, selectedDates)"
        >{{ submitFreezeText }}</Button
      >
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        type="primary"
        :disabled="isDisabledUnfreeze"
        @click="emit('submit-plan-unfreeze', freezeRecords, selectedDates)"
        >{{ submitUnfreezeText }}</Button
      >
    </Form.Item>
  </Form>
</template>

<style lang="scss">
@import '/src/app/styles/index';

.bg-cell {
  position: absolute;
  top: 0;
  border-radius: 5px;
  height: 100%;
  width: 100%;
  color: transparent;
}

.freeze-cell {
  box-shadow: 0 0px 10px $border-freeze-cell;
}

.selected-cell {
  background: #1677ff;
  color: #fff;
}

.ant-picker-calendar
  .ant-picker-cell-in-view.ant-picker-cell-today
  .ant-picker-cell-inner::before {
  border: none;
  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.25);
}

.ant-picker-calendar
  .ant-picker-cell-in-view.ant-picker-cell-selected
  .ant-picker-cell-inner {
  color: inherit;
  background: none;
}
</style>
