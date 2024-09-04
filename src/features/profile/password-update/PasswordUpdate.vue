<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';

import { useAuthStore } from '@/store';

import { PasswordForm } from './ui';

import type { PasswordUpdate } from '@/types';

const { updatePassword } = useAuthStore();

const form = ref<InstanceType<typeof PasswordForm> | null>(null);

const onSubmit = async (value: PasswordUpdate) => {
  await updatePassword(value);
  message.success('Пароль обновлен');
  form?.value?.resetFields();
};
</script>

<template>
  <PasswordForm ref="form" @submit="onSubmit" />
</template>
