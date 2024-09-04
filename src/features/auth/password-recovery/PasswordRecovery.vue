<script lang="ts" setup>
import { reactive } from 'vue';
import { Card, Result, Typography } from 'ant-design-vue';

import { PageName } from '@/pages';
import { useAuthStore } from '@/store';

import { PasswordRecoveryForm } from './ui';

const authStore = useAuthStore();

const state: {
  email: string;
  loading: boolean;
  success: boolean;
} = reactive({
  email: '',
  loading: false,
  success: false,
});

const onSubmit = async (email: string) => {
  state.loading = true;

  try {
    await authStore.requestPasswordRecovery(email);

    state.email = email;
    state.success = true;
  } finally {
    state.loading = false;
  }
};
</script>

<template>
  <Card class="password-recovery" :bordered="false">
    <Result
      v-if="state.success"
      class="password-recovery__result"
      status="success"
    >
      <template #subTitle>
        <Typography.Paragraph>
          На адрес <b>{{ state.email }}</b> отправлена ссылка для сброса пароля.
        </Typography.Paragraph>
      </template>
    </Result>
    <template v-else>
      <Typography.Title :level="4">Восстановление пароля</Typography.Title>
      <PasswordRecoveryForm :loading="state.loading" @submit="onSubmit" />
      <div class="password-recovery__back">
        <RouterLink :to="{ name: PageName.LOGIN }">
          Я вспомнил пароль
        </RouterLink>
      </div>
    </template>
  </Card>
</template>

<style lang="scss" scoped>
.password-recovery {
  @include respond-to($bp-sm) {
    padding: 8px 16px;
  }

  &__back {
    margin-top: 24px;
  }

  &__result {
    padding: 32px 0;
  }
}
</style>
