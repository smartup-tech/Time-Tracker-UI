<script setup lang="ts">
import { PageHeader } from 'ant-design-vue';
import { useRouter } from 'vue-router';

import { CreateUser } from '@/features/user';
import { PageName } from '@/pages';
import { PageBreadcrumbs } from '@/shared/ui';

import { usersBreadcrumbs } from '../config';

import type { User } from '@/types';

const router = useRouter();

const onSuccess = (user: User, keepEditing: boolean) => {
  keepEditing ? goToUserProjects(user) : goToUserList();
};

const goToUserList = () => router.push({ name: PageName.USERS });
const goToUserProjects = (user: User) =>
  router.push({
    name: PageName.USER_EDIT_PROJECTS,
    params: { userId: user.id },
  });
</script>

<template>
  <PageHeader class="page-header" title="Новый сотрудник">
    <template #breadcrumb>
      <PageBreadcrumbs :breadcrumbs="usersBreadcrumbs" />
    </template>
  </PageHeader>

  <CreateUser @success="onSuccess" @cancel="goToUserList" />
</template>
