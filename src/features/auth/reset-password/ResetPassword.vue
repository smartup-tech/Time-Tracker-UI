<script lang="ts" setup>
import { reactive } from 'vue';
import { Card, Typography } from 'ant-design-vue';

import { useAuthStore } from '@/store';

import { ErrorMessage, PasswordForm, SuccessMessage } from '@/shared/ui';

const props = defineProps<{
  token: string;
}>();

const emit = defineEmits(['success', 'error']);

const authStore = useAuthStore();

const state: {
  error: boolean;
  loading: boolean;
  success: boolean;
} = reactive({
  error: false,
  loading: false,
  success: false,
});

const onSubmit = async (newPassword: string) => {
  state.loading = true;

  try {
    await authStore.resetPassword({
      newPassword,
      token: props.token,
    });

    state.success = true;
  } catch (error) {
    state.error = true;
  } finally {
    state.loading = false;
  }
};
</script>

<template>
  <Card class="reset-password" :bordered="false">
    <SuccessMessage
      v-if="state.success"
      text="Новый пароль сохранен. Нажмите «Продолжить» для входа."
      ok-text="Продолжить"
      @ok="emit('success')"
    />
    <ErrorMessage
      v-else-if="state.error"
      text="Не удалось установить новый пароль. Повторите запрос на восстановление
        пароля."
      ok-text="Повторить запрос"
      @ok="emit('error')"
    />
    <template v-else>
      <Typography.Title :level="4">Сброс пароля</Typography.Title>
      <PasswordForm :loading="state.loading" @submit="onSubmit" />
    </template>
  </Card>
</template>

<style lang="scss" scoped>
.reset-password {
  flex: auto;

  @include respond-to($bp-sm) {
    padding: 8px 16px;
  }
}
</style>
