<script lang="ts" setup>
import { computed, reactive, shallowRef } from 'vue';
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Select,
  message,
} from 'ant-design-vue';
import { useProductionCalendarStore } from '@/store';
import {
  AddableProductionCalendarDay,
  ProductionCalendarDayStatus,
  calendarDayOptions,
} from '@/types/calendar';
import { AddProductionCalendarDay } from './types';
import { SelectValue } from 'ant-design-vue/lib/select';
import { Rule } from 'ant-design-vue/lib/form';
import { Dayjs } from 'dayjs';

interface Props {
  disabledDates: string[]
}

const { saveCalendarDay } = useProductionCalendarStore();

const props = defineProps<Props>()

const emits = defineEmits(['success', 'cancel']);

const rules: Record<string, Rule[]> = reactive({
  day: [
    {
      required: true,
      message: 'Укажите особенный день календаря',
    },
  ],
  status: [{ required: true, message: 'Укажите тип особенного дня календаря' }],
  hours: [
    {
      type: 'number',
      required: true,
      message: 'Значение должно быть положительным числом',
      validator: async (rule: Rule, value: number) => {
        if (
          value > 0 ||
          (value === 0 &&
            calendarDay.status === ProductionCalendarDayStatus.WEEKEND)
        ) {
          return Promise.resolve();
        }

        return Promise.reject('Значение должно быть положительным числом');
      },
    },
  ],
});

const isDisabledHours = shallowRef(false);

const calendarDay = reactive<AddProductionCalendarDay>({
  day: undefined,
  hours: undefined,
  status: undefined,
});

const onChangeDayStatus = (value: SelectValue) => {
  const option = calendarDayOptions.find((option) => option.value === value);
  calendarDay.hours = option?.hours;
  isDisabledHours.value =
    option?.value !== ProductionCalendarDayStatus.SHORTENED_DAY;
};

const onAddProductionCalendarDaySubmit = async () => {
  let body: AddableProductionCalendarDay;
  if (
    !calendarDay.day ||
    !calendarDay.status ||
    calendarDay.hours === undefined
  ) {
    return;
  }
  body = {
    day: calendarDay.day.toISODate(),
    status: calendarDay.status,
    hours: String(calendarDay.hours),
  };
  const res = await saveCalendarDay(body);
  if (res) {
    message.success('День добавлен в календарь');
    emits('success', res);
  }
};

const isDisabledAddButon = computed<boolean>(() => {
  return (
    !calendarDay.day || !calendarDay.status || calendarDay.hours === undefined
  );
});

const disabledDate = (current: Dayjs) => {
  return props.disabledDates.includes(current.toISODate())
};
</script>

<template>
  <Form
    class="production-calendar-form"
    layout="vertical"
    :model="calendarDay"
    :rules="rules"
    autocomplete="off"
    hide-required-mark
    @finish="onAddProductionCalendarDaySubmit"
  >
    <Form.Item
      class="production-calendar-form__item"
      name="day"
      :label="'Особенный день календаря'"
    >
      <DatePicker
        v-model:value="calendarDay.day"
        :allowClear="false"
        :show-today="false"
        :disabledDate="disabledDate"
        format="D MMMM YYYY"
      />
    </Form.Item>
    <Form.Item
      class="production-calendar-form__item"
      name="status"
      :label="'Особый день'"
    >
      <Select
        :options="calendarDayOptions"
        v-model:value="calendarDay.status"
        @change="onChangeDayStatus"
      />
    </Form.Item>
    <Form.Item
      class="production-calendar-form__item"
      name="hours"
      :label="'Норма рабочего времени'"
    >
      <InputNumber
        v-model:value="calendarDay.hours"
        :disabled="isDisabledHours"
      />
    </Form.Item>
    <Form.Item
      class="production-calendar-form__item production-calendar-form__buttons"
    >
      <Button htmlType="submit" :disabled="isDisabledAddButon" type="primary"
        >Добавить день в календарь</Button
      >
      <Button htmlType="reset" type="primary" @click="emits('cancel')"
        >Отмена</Button
      >
    </Form.Item>
  </Form>
</template>

<style lang="scss">
.production-calendar-form {
  width: 100%;

  &__item {
    width: 100%;
  }

  &__item .ant-picker,
  .ant-input-number {
    width: 100%;
  }

  &__buttons .ant-form-item-control-input-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
}
</style>
