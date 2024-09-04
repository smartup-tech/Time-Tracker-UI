<script setup lang="ts">
import { PageHeader, Tabs, TabPane } from 'ant-design-vue';

import { Approval } from '@/widgets';
import { shallowRef, watch } from 'vue';
import { useApprovalPeriodsStore } from '@/store';

const { fetchSubmittedHours } = useApprovalPeriodsStore()

const activeTab = shallowRef(0);
const tabs = [
  {
    title: "Согласование по периодам",
    component: Approval.ApprovalPeriods
  },
  {
    title: "Согласование по всему периоду",
    component: Approval.ApprovalDays
  }
]

watch(activeTab, () => {
  fetchSubmittedHours()
})
</script>
<template>
  <PageHeader title="Согласование часов" />
  <Tabs v-model:activeKey="activeTab">
    <TabPane v-for="(tab, index) in tabs" :key="index" :tab="tab.title">
      <component :is="tab.component" />
    </TabPane>
  </Tabs>
</template>
