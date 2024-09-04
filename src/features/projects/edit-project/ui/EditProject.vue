<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';

import { ProjectForm } from '@/entities/project';
import { useProjectsStore } from '@/store';

import type { EditProject, Project } from '@/types';

type Props = {
  project: Project;
};

const props = defineProps<Props>();
const emit = defineEmits(['success', 'cancel']);

const { updateProject } = useProjectsStore();
const { isLoading } = storeToRefs(useProjectsStore());

const onSubmit = async (model: EditProject) => {
  await updateProject(props.project.id, model);
  message.success('Проект обновлен');
  emit('success');
};

const onCancel = () => emit('cancel');
</script>

<template>
  <ProjectForm
    v-if="!isLoading"
    :initial-data="props.project"
    :submit="onSubmit"
    @cancel="onCancel"
  />
</template>
