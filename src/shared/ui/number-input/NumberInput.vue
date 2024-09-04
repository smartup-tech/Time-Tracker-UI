<script setup lang="ts">
import { InputNumber } from 'ant-design-vue';

const parser = (value: string) => value.replace(/,/g, '.');
</script>

<template>
  <InputNumber :parser="parser" />
</template>
