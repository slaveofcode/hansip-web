<template>
  <div class="flex flex-col">
    <h1 class="mb-3"><span class="text-green-500 font-bold">Securi</span> File Sharing</h1>
    <div class="flex flex-row justify-center">
      <router-link :to="{name: 'create-account'}" class="mr-2 btn btn-blue">Create Account</router-link>
      <router-link :to="{name: 'login-account'}" class="mr-2 btn btn-blue">Login Account</router-link>
      <router-link :to="{name: 'file-share'}" class="btn btn-orange">Share File</router-link>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 3.2em;
  line-height: 1.1;
}
</style>
