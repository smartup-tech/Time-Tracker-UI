<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

import { Auth } from '@/features/auth';

const router = useRouter();
const route = useRoute();

const onLoginSuccess = async () => {
  const { next } = route.query;

  await router.push(next ? String(next) : '/');
};
</script>

<template>
  <Auth.Login.Form class="login-form" @success="onLoginSuccess" />
</template>

<style lang="scss" scoped>
.login-form {
  width: 100%;
}
</style>
