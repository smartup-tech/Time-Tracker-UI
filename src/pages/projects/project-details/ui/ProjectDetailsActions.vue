<script lang="ts" setup>
import { Button, Space } from 'ant-design-vue';
import { breakpointsAntDesign, useBreakpoints } from '@vueuse/core';

import { PageName } from '@/pages';
import { LAIcon } from '@/shared/ui';

const breakpoints = useBreakpoints(breakpointsAntDesign);
const sm = breakpoints.smallerOrEqual('sm');

type Props = {
  projectId: number;
};

defineProps<Props>();
</script>

<template>
  <Space>
    <RouterLink
      :to="{
        name: PageName.PROJECTS_EDIT,
        params: {
          projectId,
        },
      }"
      #default="{ navigate }"
    >
      <Button type="primary" @click="navigate">
        <template v-if="!sm">Редактировать</template>
        <template v-if="sm" #icon>
          <LAIcon icon="pen" size="large" />
        </template>
      </Button>
    </RouterLink>
  </Space>
</template>
