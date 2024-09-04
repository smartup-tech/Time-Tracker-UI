<script lang="ts" setup>
import { Button, message } from 'ant-design-vue';

import { useBoolean } from '@/shared/lib';

import { SubmitHoursModal } from '.';

const emit = defineEmits(['success']);
const [modalVisible, { setTrue: showModal, setFalse: closeModal }] =
  useBoolean();

const onSuccess = async (text: string) => {
  closeModal();
  message.success(text);
  emit('success');
};
</script>

<template>
  <div class="submit-timesheet">
    <Button type="primary" @click="showModal">
      Отправить на согласование
    </Button>
  </div>
  <SubmitHoursModal v-model:visible="modalVisible" @success="onSuccess" />
</template>

<style lang="scss" scoped>
.submit-timesheet {
  margin-top: 24px;
  text-align: center;
}
</style>
