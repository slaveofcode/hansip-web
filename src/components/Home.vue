<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore as getAccountStore } from '@/stores/account'


const router = useRouter()
const accountStore = getAccountStore()

const isAuthenticated = computed(() => {
  return accountStore.isAuthenticated
})

const logout = () => {
  accountStore.logout()
  router.go(0)
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-row justify-center items-center mb-3">
      <img src="/logo-256.png" class="w-40" />
    </div>
    <h1 class="mb-3"><span class="text-green-500 font-bold">Hansip</span> File Sharing</h1>
    <div class="flex flex-row justify-center">
      <div v-if="!isAuthenticated">
        <router-link :to="{name: 'create-account'}" class="mr-2 btn btn-blue">Create Account</router-link>
        <router-link :to="{name: 'login-account'}" class="btn btn-blue">Login Account</router-link>
      </div>
      <div v-if="isAuthenticated">
        <router-link :to="{name: 'file-share'}" class="mr-2 btn btn-orange">Share File</router-link>
        <button @click="logout()" class="btn btn-blue">Logout</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 3.2em;
  line-height: 1.1;
}
</style>
