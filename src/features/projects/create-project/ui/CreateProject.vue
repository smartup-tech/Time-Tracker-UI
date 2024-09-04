<script setup lang="ts">
import { message } from 'ant-design-vue';

import { ProjectForm } from '@/entities/project';
import { useProjectsStore } from '@/store';

import type { CreateProject } from '@/types';

const emit = defineEmits(['success', 'cancel']);

const { createProject } = useProjectsStore();

const onSubmit = async (model: CreateProject) => {
  await createProject(model);
  message.success('Проект добавлен');
  emit('success');
};

const onCancel = () => emit('cancel');
</script>

<template>
  <ProjectForm :submit="onSubmit" @cancel="onCancel" />
</template>
