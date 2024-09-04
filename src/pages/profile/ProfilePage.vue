<script lang="ts" setup>
import { Card, Divider, PageHeader } from 'ant-design-vue';

import { PasswordUpdate, ProfileEdit } from '@/features/profile';
</script>

<template>
  <PageHeader class="page-header" title="Профиль" />
  <Card :bordered="false">
    <ProfileEdit />
    <Divider orientation="left" :orientation-margin="0">Пароль</Divider>
    <PasswordUpdate />
  </Card>
</template>

<style lang="scss">
.page-header {
  padding-right: 0;
  padding-left: 0;
}
</style>
