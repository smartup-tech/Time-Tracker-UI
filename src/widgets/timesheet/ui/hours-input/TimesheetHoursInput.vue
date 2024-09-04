<script setup lang="ts">
import { computed, ref } from 'vue';

import { NumberInput } from '@/shared/ui';

const props = withDefaults(
  defineProps<{
    active: boolean;
    disabled: boolean;
    value?: number;
  }>(),
  {
    active: false,
    disabled: false,
  }
);

const emit = defineEmits(['focus', 'update:value']);

const input = ref<HTMLInputElement>();

const innerValue = computed<number | undefined>({
  get: () => props.value,
  set: (value) => emit('update:value', value),
});

const select = () => {
  if (input.value) {
    input.value.focus();
  }
};

const onFocus = (e: FocusEvent) => {
  (e.target as HTMLInputElement).select();
  emit('focus');
};

defineExpose({ select });
</script>

<template>
  <NumberInput
    :class="['hours-input', active && 'hours-input_active']"
    :min="0"
    :step="0.01"
    :controls="false"
    :precision="2"
    :max="24"
    :disabled="disabled"
    ref="input"
    size="small"
    type="text"
    v-model:value="innerValue"
    @click.stop="select"
    @focus="onFocus"
  />
</template>

<style lang="scss" scoped>
.hours-input {
  font-size: 12px;
  width: 48px;

  &_active {
    border-color: #1890ff;
  }

  :deep(.ant-input-number-input) {
    text-align: center;
    padding: 0;
  }
}
</style>
