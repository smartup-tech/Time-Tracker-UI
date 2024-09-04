<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';

import { useAuthStore } from '@/store';

import { ProfileForm } from './ui';

import type { PersonalData } from '@/types';

const { fetchProfile, updateProfile } = useAuthStore();
const { profile } = storeToRefs(useAuthStore());

const onSubmit = async (value: PersonalData) => {
  await updateProfile(value);
  message.success('Профиль обновлен');
};

onBeforeMount(async () => {
  await fetchProfile();
});
</script>

<template>
  <ProfileForm v-if="profile" :initial-value="profile" @submit="onSubmit" />
</template>
