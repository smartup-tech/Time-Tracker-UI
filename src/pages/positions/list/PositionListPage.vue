<script lang="ts" setup>
import { Button, PageHeader } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { PageName } from '@/pages/config';
import { useAuthStore } from '@/store';
import { PositionList } from '@/widgets/positions';

const { canCreatePositions } = storeToRefs(useAuthStore());
</script>

<template>
  <PageHeader title="Должности">
    <template #extra>
      <RouterLink
        v-if="canCreatePositions"
        :to="{ name: PageName.POSITION_CREATE }"
        custom
        v-slot="{ navigate }"
      >
        <Button type="primary" @click="navigate">Добавить</Button>
      </RouterLink>
    </template>
  </PageHeader>

  <PositionList />
</template>
