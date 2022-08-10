<template>
  <div class="flex flex-col">
    <h1 class="mb-3"><span class="text-green-500 font-bold">404</span> Not Found</h1>
    <div class="flex flex-row justify-center">
      <router-link :to="{name:'home'}" class="block btn btn-blue">Back</router-link>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 3.2em;
  line-height: 1.1;
}
</style>
