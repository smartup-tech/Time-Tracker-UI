<script lang="ts" setup>
import { message } from 'ant-design-vue';

import { PositionForm } from '@/entities/position';
import { usePositionStore } from '@/store';

import type { CreatePosition } from '@/types';

const emit = defineEmits(['success', 'cancel']);

const { createPosition } = usePositionStore();

const onSubmit = async (model: CreatePosition) => {
  await createPosition(model);
  message.success('Должность добавлена');

  emit('success');
};
</script>

<template>
  <PositionForm :submit="onSubmit" @cancel="() => emit('cancel')" />
</template>
