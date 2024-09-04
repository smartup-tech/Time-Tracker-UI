<script lang="ts" setup>
import { reactive } from 'vue';
import { Card, Typography } from 'ant-design-vue';

import { ErrorMessage, PasswordForm, SuccessMessage } from '@/shared/ui';
import { useAuthStore } from '@/store';

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
  <Card class="set-password" :bordered="false">
    <SuccessMessage
      v-if="state.success"
      text="Новый пароль сохранен. Нажмите «Продолжить» для входа."
      ok-text="Продолжить"
      @ok="emit('success')"
    />
    <ErrorMessage
      v-else-if="state.error"
      text="Не удалось установить новый пароль. Воспользуйтесь восстановлением
        пароля."
      ok-text="Восстановить пароль"
      @ok="emit('error')"
    />
    <template v-else>
      <Typography.Title :level="4">Установка пароля</Typography.Title>
      <PasswordForm :loading="state.loading" @submit="onSubmit" />
    </template>
  </Card>
</template>

<style lang="scss" scoped>
.set-password {
  flex: auto;

  @include respond-to($bp-sm) {
    padding: 8px 16px;
  }
}
</style>
