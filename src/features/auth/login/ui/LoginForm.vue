<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputPassword,
} from 'ant-design-vue';

import { EMAIL_MAX_LENGTH } from '@/constants';
import { PageName } from '@/pages';
import { useAuthStore } from '@/store';

import type { Rule } from 'ant-design-vue/lib/form';
import type { Credentials } from '@/types';

const emit = defineEmits(['success']);

const authStore = useAuthStore();

const loginFailed = ref<boolean>(false);

const credentials: Credentials = reactive({
  email: '',
  password: '',
});

const rules: Record<string, Rule[]> = reactive({
  email: [
    {
      required: true,
      message: 'Введите адрес электронной почты',
    },
    {
      type: 'email',
      message: 'Введите корректный адрес электронной почты',
    },
  ],
  password: [{ required: true, message: 'Введите пароль' }],
});

const onLoginSubmit = async () => {
  loginFailed.value = false;
  try {
    await authStore.login(credentials);
    emit('success');
  } catch (error) {
    loginFailed.value = true;
  }
};

watch(
  () => credentials,
  () => (loginFailed.value = false),
  { deep: true }
);
</script>

<template>
  <Card :bordered="false" class="login-form">
    <Form
      :model="credentials"
      class="login-form__form"
      layout="vertical"
      autocomplete="off"
      hide-required-mark
      @finish="onLoginSubmit"
    >
      <Form.Item name="email" label="Эл. почта" :rules="rules.email">
        <Input
          :maxlength="EMAIL_MAX_LENGTH"
          size="large"
          v-model:value.trim="credentials.email"
        />
      </Form.Item>

      <Form.Item name="password" label="Пароль" :rules="rules.password">
        <InputPassword size="large" v-model:value.trim="credentials.password" />
        <template #extra>
          <div class="login-form__link">
            <RouterLink :to="{ name: PageName.PASSWORD_RECOVERY }">
              Не помню пароль
            </RouterLink>
          </div>
        </template>
      </Form.Item>

      <Form.Item v-if="loginFailed">
        <Alert
          type="error"
          class="login-form__error"
          message="Неправильный адрес электронной почты или пароль."
        />
      </Form.Item>

      <Button type="primary" size="large" html-type="submit">Войти</Button>
    </Form>
  </Card>
</template>

<style lang="scss">
.login-form {
  @include respond-to($bp-sm) {
    padding: 8px 16px;
  }

  &__link {
    margin-top: 8px;
  }
}
</style>
