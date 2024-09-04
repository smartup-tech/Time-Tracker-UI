<script lang="ts" setup>
import { Descriptions, DescriptionsItem } from 'ant-design-vue';

import { getFullDate } from '@/shared/lib';

import type { ProjectDetails } from '@/types';

type Props = {
  project: ProjectDetails;
};

const props = defineProps<Props>();
</script>

<template>
  <Descriptions :colon="false">
    <DescriptionsItem label="Создан">
      {{ getFullDate(props.project?.createdDate) }}
    </DescriptionsItem>
  </Descriptions>
</template>
