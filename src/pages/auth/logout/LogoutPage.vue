<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

import { PageName } from '@/pages/config';
import { useAuthStore } from '@/store';

const { logout } = useAuthStore();
const router = useRouter();

onBeforeMount(async () => {
  await logout();
  await router.push({ name: PageName.LOGIN });
});
</script>

<template>
  <span />
</template>
