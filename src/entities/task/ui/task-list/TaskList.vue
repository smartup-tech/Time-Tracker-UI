<script lang="ts" setup>
import { List } from 'ant-design-vue';

import TaskItem from '../task-item/TaskItem.vue';

import type { Task } from '@/types';

type Props = {
  projectId: number;
  tasks: Task[];
  loading: boolean;
};

defineProps<Props>();
</script>

<template>
  <List :data-source="tasks" :loading="loading">
    <template #renderItem="{ item: task }">
      <TaskItem :task="task" :project-id="projectId" />
    </template>
  </List>
</template>
