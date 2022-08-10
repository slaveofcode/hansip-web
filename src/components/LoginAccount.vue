<script lang="ts" setup>
import { ref } from "@vue/reactivity";
import { useAuth } from "@websanova/vue-auth";

const auth = useAuth()

const submitForm = () => {
    console.log('submitted', email.value, password.value, cpassword.value);
    auth.login({
        data: {
            email: 'hello@example.com',
            password: 'abcd1234'
        },
        redirect: {name: 'home'},
        remember: '{"name": "Default"}',
        staySignedIn: true,
        fetchUser: true
    });
}

const email = ref()
const password = ref();
const cpassword = ref();
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