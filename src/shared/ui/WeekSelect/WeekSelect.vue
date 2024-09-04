<script lang="ts" setup>
import { Button, DatePicker } from 'ant-design-vue';
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';

import { DateFormat } from '@/constants';
import { LAIcon } from '@/shared/ui';

type Props = {
  value?: Date | string;
};

const props = withDefaults(defineProps<Props>(), {
  value: dayjs().format(DateFormat.ISO_DATE),
});

const emit = defineEmits(['update:value']);

const startOfWeek = ref<dayjs.Dayjs>(
  dayjs(props.value, DateFormat.ISO_DATE).startOf('week')
);

const date = computed({
  get: () => startOfWeek.value,
  set: (value) => (startOfWeek.value = value.startOf('week')),
});

const nextWeek = () => {
  startOfWeek.value = startOfWeek.value.add(1, 'week');
};

const previousWeek = () => {
  startOfWeek.value = startOfWeek.value.subtract(1, 'week');
};

watch(
  () => startOfWeek.value,
  (newValue) => emit('update:value', newValue.format(DateFormat.ISO_DATE))
);
</script>

<template>
  <div class="week-select">
    <Button type="text" @click="previousWeek">
      <template #icon>
        <LAIcon icon="angle-left" size="small" />
      </template>
    </Button>
    <DatePicker
      :allow-clear="false"
      :bordered="false"
      format="D MMM YYYY"
      input-read-only
      :show-today="false"
      v-model:value="date"
    >
      <template #suffixIcon></template>
    </DatePicker>
    <Button type="text" @click="nextWeek">
      <template #icon>
        <LAIcon icon="angle-right" size="small" />
      </template>
    </Button>
  </div>
</template>
<style lang="scss" scoped>
.week-select {
  display: inline-flex;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
}

:deep(.ant-picker) {
  padding: 0;
}

:deep(.ant-picker-input > input) {
  text-align: center;
  width: 110px;
}
</style>
