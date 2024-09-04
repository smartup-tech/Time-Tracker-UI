<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue';
import ruRU from 'ant-design-vue/es/locale/ru_RU';
import './styles/index.scss';
</script>

<template>
  <ConfigProvider :locale="ruRU">
    <RouterView />
  </ConfigProvider>
</template>

<style scoped></style>
