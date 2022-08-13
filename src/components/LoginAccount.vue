<script lang="ts" setup>
import { ref } from "@vue/reactivity";
import { useRouter } from 'vue-router';
import { useStore as getAccountStore } from '../stores/account'

const accountStore = getAccountStore()
const router = useRouter()

const email = ref()
const password = ref();

const submitForm = async () => {
    const res = await accountStore.login({
        email: email.value,
        password: password.value
    })

    if (!res) {
        alert('Failed credential')
        return
    }

    accountStore.reloadAuthStatus()

    router.push({
        name: 'home'
    })
}
</script>

<template>
  <div class="flex flex-col">
    <h1 class="text-3xl">Login Account</h1>
    <form @submit.prevent="submitForm()" class="flex flex-col justify-start items-start mt-3">
        <label class="form-control">
            <span>Email Address</span>
            <input type="email" v-model="email"/>
        </label>
        <label class="form-control">
            <span>Password</span>
            <input type="password" v-model="password"/>
        </label>
        <div class="flex flex-row justify-between items-center w-full">
            <router-link :to="{name:'home'}" class="block btn btn-blue">Back</router-link>
            <button type="submit" class="block btn btn-orange">Login</button>
        </div>
    </form>
  </div>
</template>

<style scoped>
.form-control {
    @apply flex flex-col items-start;
    @apply mb-3;
}

.form-control > input {
    @apply bg-white rounded-md text-2xl text-gray-800 px-2;
}
</style>