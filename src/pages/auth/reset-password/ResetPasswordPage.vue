<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

import { Auth } from '@/features/auth';
import { PageName } from '@/pages/config';

const props = withDefaults(
  defineProps<{
    token: string;
  }>(),
  {
    token: '',
  }
);

const router = useRouter();

const onSuccess = () => router.push({ name: PageName.LOGIN });
const onError = () => router.push({ name: PageName.PASSWORD_RECOVERY });

onBeforeMount(() => {
  if (!props.token) {
    router.push({
      name: PageName.LOGIN,
    });
  }
});
</script>

<template>
  <Auth.ResetPassword :token="token" @success="onSuccess" @error="onError" />
</template>
