<script setup lang="ts">
import { Button, PageHeader } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { PageName } from '@/pages';
import { useAuthStore } from '@/store';
import { Users } from '@/widgets';

const { canCreateUsers } = storeToRefs(useAuthStore());
</script>

<template>
  <PageHeader class="page-header" title="Сотрудники">
    <template #extra>
      <RouterLink
        v-if="canCreateUsers"
        :to="{ name: PageName.USER_CREATE }"
        custom
        v-slot="{ navigate }"
      >
        <Button type="primary" @click="navigate">Добавить</Button>
      </RouterLink>
    </template>
  </PageHeader>
  <Users.UserList />
</template>

<style lang="scss" scoped>
.page-header {
  padding-right: 0;
  padding-left: 0;
}
</style>
