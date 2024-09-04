<script lang="ts" setup>
import { computed } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { Button, Calendar, Form } from 'ant-design-vue';
import { useTimeFreezeStore } from '@/store';
import { storeToRefs } from 'pinia';

type Props = {
  disableAfter?: Dayjs;
  disableBefore?: Dayjs;
  freezeRecords: string[];
  inclusive?: boolean;
  scheduled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  inclusive: false,
  scheduled: true,
});

const { unfreezeRecord } = storeToRefs(
  useTimeFreezeStore()
);

const emit = defineEmits(['submit', 'update:freezeRecords']);

const isDisabledDate = (currentDate: Dayjs) =>
  (props.disableBefore
    ? currentDate.isBefore(props.disableBefore, 'day')
    : false) ||
  (props.inclusive && props.disableBefore
    ? currentDate.isSame(props.disableBefore, 'day')
    : false) ||
  (unfreezeRecord.value ? dayjs(unfreezeRecord.value?.freezeDate).isSame(currentDate, 'day') : false) ||
  (props.disableAfter ? currentDate.isAfter(props.disableAfter, 'day') : false);

const label = computed<string>(() =>
  props.inclusive ? 'Блокировать часы по (включительно)' : 'Блокировать часы до'
);

const submitText = computed<string>(() =>
  props.scheduled ? 'Запланировать блокировку' : 'Заблокировать'
);

const addFreezeDate = (date: Dayjs) => {
  const freezeRecords = [...props.freezeRecords];
  freezeRecords.push(date.toISODate())
  emit('update:freezeRecords', freezeRecords);
}

const deleteFreezeDate = (index: number) => {
  const freezeRecords = [...props.freezeRecords];
  freezeRecords.splice(index, 1);
  emit('update:freezeRecords', freezeRecords);
}

const handleSelect = (selectedDate: Dayjs | string) => {
  if (typeof selectedDate !== 'object') {
    return;
  }
  const index = props.freezeRecords.findIndex(freezeRecord => freezeRecord === selectedDate.toISODate());
  if (index !== -1) {
    deleteFreezeDate(index)
  } else {
    addFreezeDate(selectedDate);
  }
}
</script>

<template>
  <Form layout="vertical" @submit="emit('submit', freezeRecords)">
    <Form.Item :label="label">
      <Calendar 
        :fullscreen="false"
        :disabledDate="isDisabledDate"
        @select="handleSelect"
      >
        <template #dateCellRender="{ current }">
          <div
            :class="{
              'freeze-cell': props.freezeRecords.includes(current.toISODate()),
            }"
          />
        </template>
      </Calendar>
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" type="primary" :disabled="freezeRecords.length === 0" >{{ submitText }}</Button>
    </Form.Item>
  </Form>
</template>

<style lang="scss">
@import '/src/app/styles/index';

.freeze-cell {
  position:absolute;
  top: 0;
 
  border: 1px solid $border-freeze-cell;
  border-radius: 5px;

  height: 100%;
  width: 100%;
}

.ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before {
  border: none;
}

.ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner {
  color: inherit;
  background: none;
}
</style>
