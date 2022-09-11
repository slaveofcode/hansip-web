<script lang="ts" setup>
  import { ModalsContainer } from 'vue-final-modal'
</script>

<template>
  <div class="flex flex-row justify-center w-full">
    <router-view></router-view>
    <ModalsContainer></ModalsContainer>
  </div>
</template>
