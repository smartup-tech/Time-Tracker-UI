<script setup lang="ts"></script>

<template>
  <div class="auth-page">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.auth-page {
  display: flex;
  flex: auto;
  align-self: center;
  align-items: center;
  justify-content: center;
  width: 92%;
  max-width: 420px;
}
</style>
