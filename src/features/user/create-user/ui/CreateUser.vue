<script lang="ts" setup>
import { message, Card } from 'ant-design-vue';

import { UserForm } from '@/entities/user';
import { useUsersStore } from '@/store';

import type { CreateUser } from '@/types';

const emit = defineEmits(['success', 'cancel']);

const { createUser } = useUsersStore();

const onSubmit = async (value: CreateUser, keepEditing: boolean) => {
  const createdUser = await createUser(value as CreateUser);
  message.success('Сотрудник добавлен');

  emit('success', createdUser, keepEditing);
};
</script>

<template>
  <Card :bordered="false">
    <UserForm
      :submit="(value, keepEditing) => onSubmit(value as CreateUser, keepEditing)"
      @cancel="() => emit('cancel')"
    />
  </Card>
</template>
