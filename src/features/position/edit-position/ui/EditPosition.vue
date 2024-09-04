<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { message } from 'ant-design-vue';

import { PositionForm } from '@/entities/position';
import { usePositionStore } from '@/store';

import type { CreatePosition, Position } from '@/types';

const props = defineProps<{
  positionId: number;
}>();

const emit = defineEmits(['success', 'cancel']);

const { updatePosition, fetchById } = usePositionStore();

const model = ref<Position>();

const onSubmit = async (model: CreatePosition) => {
  await updatePosition(props.positionId, model);
  message.success('Должность обновлена');

  emit('success');
};

onBeforeMount(async () => {
  const position = await fetchById(props.positionId);

  model.value = position;
});
</script>

<template>
  <PositionForm
    :initial-data="model"
    :submit="onSubmit"
    @cancel="() => emit('cancel')"
  />
</template>
