<script lang="ts" setup>
import { Button, ButtonProps, message, Modal } from 'ant-design-vue';
import { useDateFormat } from '@vueuse/shared';

import { DateFormat } from '@/constants';
import { formatHours, getFullName, useBoolean } from '@/shared/lib';
import { LAIcon } from '@/shared/ui';
import { useApprovalDetailsStore } from '@/store';

import type { SubmittedDataForAction } from '@/types';

const props = withDefaults(
  defineProps<{
    buttonProps?: ButtonProps;
    hours: SubmittedDataForAction[];
  }>(),
  {
    buttonProps: () => ({
      disabled: false,
    }),
  }
);

const emit = defineEmits<{
  (e: 'submit', trackUnitIds: number[]): number[];
}>();

const [isVisible, { setTrue: showModal, setFalse: closeModal }] = useBoolean();

const { approveHours } = useApprovalDetailsStore();

const [isLoading, { set: setIsLoading }] = useBoolean(false);

const onSubmit = async () => {
  setIsLoading(true);

  try {
    const trackUnitIds = props.hours.map((item) => item.trackUnitId);
    await approveHours(trackUnitIds);
    emit('submit', trackUnitIds);
    message.success('Часы согласованы');
    closeModal();
  } finally {
    setIsLoading(false);
  }
};
</script>

<template>
  <Button
    :disabled="buttonProps.disabled"
    :size="buttonProps.size"
    type="primary"
    @click="showModal"
  >
    Утвердить
  </Button>
  <Modal
    destroy-on-close
    title="Согласовать часы"
    ok-text="Согласовать"
    :confirm-loading="isLoading"
    v-model:visible="isVisible"
    @ok="onSubmit"
  >
    <div v-for="entry in hours" :key="entry.trackUnitId">
      {{ useDateFormat(entry.workDay, DateFormat.DOT).value }} -
      {{ formatHours(entry.hours) }}, {{ getFullName(entry) }},
      {{ entry.taskName }}
    </div>

    <template #closeIcon>
      <LAIcon icon="times" size="large" />
    </template>
  </Modal>
</template>
