<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import {
  Checkbox,
  CheckboxGroup,
  CheckboxOptionType,
  Modal,
} from 'ant-design-vue';

import {
  addToSum,
  getFormattedWeekRange,
  getPluralHours,
  useBoolean,
} from '@/shared/lib';
import { LAIcon } from '@/shared/ui';
import { useTimesheetStore } from '@/store';

import type { CheckboxChangeEvent } from 'ant-design-vue/es/checkbox/interface';

const props = defineProps<{
  visible: boolean;
}>();
const emit = defineEmits(['success', 'update:visible']);

const { submitTimesheet } = useTimesheetStore();
const { unsubmitted } = storeToRefs(useTimesheetStore());

const [isSubmitting, { set: setIsSubmitting }] = useBoolean(false);

const state: {
  checkAll: boolean;
  indeterminate: boolean;
  selectedWeeks: string[];
} = reactive({
  checkAll: false,
  indeterminate: false,
  selectedWeeks: [],
});

const isVisible = computed<boolean>({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

const options = computed<CheckboxOptionType[]>(() =>
  unsubmitted.value.map(({ hours, week }) => ({
    label: getOptionLabel({ hours, week }),
    value: week,
  }))
);

const selectedHours = computed<number>(() =>
  unsubmitted.value
    .filter((item) => state.selectedWeeks.includes(item.week))
    .map((item) => item.hours)
    .reduce(addToSum, 0)
);

const getOptionLabel = ({ hours, week }: { hours: number; week: string }) =>
  `${getPluralHours(hours)} ${getFormattedWeekRange(week)}`;

const submit = async () => {
  setIsSubmitting(true);
  await submitTimesheet(state.selectedWeeks);
  setIsSubmitting(false);
  emit(
    'success',
    `${getPluralHours(selectedHours.value)} отправлено на согласование`
  );
};

const reset = () => (state.selectedWeeks = []);

const onCheckAllChange = (e: CheckboxChangeEvent) => {
  if (e.target.checked) {
    state.selectedWeeks = options.value.map(
      ({ value }: CheckboxOptionType) => value as string
    );
  } else {
    state.selectedWeeks = [];
  }
};

watch(
  () => state.selectedWeeks,
  (value: string[]) => {
    const allSelected =
      Boolean(value.length) && value.length === options.value.length;

    state.indeterminate = Boolean(value.length) && !allSelected;
    state.checkAll = allSelected;
  }
);
</script>

<template>
  <Modal
    destroy-on-close
    title="Отправить на согласование"
    ok-text="Отправить"
    :ok-button-props="{
      disabled: selectedHours === 0,
    }"
    :confirm-loading="isSubmitting"
    v-model:visible="isVisible"
    @ok="submit"
    @cancel="reset"
  >
    <div class="list" :style="{ marginBottom: '16px' }">
      <div :style="{ marginBottom: '8px' }">
        <Checkbox
          :indeterminate="state.indeterminate"
          v-model:checked="state.checkAll"
          @change="onCheckAllChange"
          >Все</Checkbox
        >
      </div>
      <CheckboxGroup v-model:value="state.selectedWeeks">
        <div
          v-for="(option, index) in options"
          :key="index"
          :style="{ marginBottom: '4px' }"
        >
          <Checkbox :value="option.value">{{ option.label }}</Checkbox>
        </div>
      </CheckboxGroup>
    </div>

    Итого для согласования: {{ getPluralHours(selectedHours) }}

    <template #closeIcon>
      <LAIcon icon="times" size="large" />
    </template>
  </Modal>
</template>
