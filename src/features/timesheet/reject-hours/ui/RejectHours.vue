<script lang="ts" setup>
import { ref } from 'vue';
import {
  Button,
  ButtonProps,
  Form,
  message,
  Modal,
  Textarea,
} from 'ant-design-vue';
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
  (e: 'reject', trackUnitIds: number[]): number[];
}>();

const { rejectHours } = useApprovalDetailsStore();

const [isVisible, { setTrue: showModal, setFalse: closeModal }] = useBoolean();
const [isLoading, { set: setIsLoading }] = useBoolean(false);

const rejectReason = ref<string>('');

const onSubmit = async () => {
  setIsLoading(true);

  try {
    const trackUnitIds = props.hours.map((item) => item.trackUnitId);
    await rejectHours(
      trackUnitIds,
      rejectReason.value
    );
    emit('reject', trackUnitIds);
    message.success('Часы отклонены');
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
    @click="showModal"
  >
    Отказать
  </Button>
  <Modal
    destroy-on-close
    title="Отказать в согласовании"
    ok-text="Отказать"
    :confirm-loading="isLoading"
    v-model:visible="isVisible"
    @ok="onSubmit"
  >
    <div v-for="entry in hours" :key="entry.trackUnitId">
      {{ useDateFormat(entry.workDay, DateFormat.DOT).value }} -
      {{ formatHours(entry.hours) }}, {{ getFullName(entry) }},
      {{ entry.taskName }}
    </div>
    <Form layout="vertical" :style="{ marginTop: '24px' }">
      <Form.Item label="Причина" :style="{ margin: 0 }">
        <Textarea
          show-count
          :maxlength="1000"
          placeholder="Комментарий для сотрудника"
          v-model:value="rejectReason"
        />
      </Form.Item>
    </Form>

    <template #closeIcon>
      <LAIcon icon="times" size="large" />
    </template>
  </Modal>
</template>
