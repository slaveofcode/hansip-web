<script lang="ts" setup>
import { ref } from "@vue/reactivity";

const submitForm = () => {
    console.log('submitted', email.value, password.value, cpassword.value);
}

const email = ref()
const password = ref();
const cpassword = ref();
</script>

<template>
  <div class="flex flex-col">
    <h1 class="text-3xl">Create Account</h1>
    <form @submit.prevent="submitForm()" class="flex flex-col justify-start items-start mt-3">
        <label class="form-control">
            <span>Email Address</span>
            <input type="email" v-model="email"/>
        </label>
        <label class="form-control">
            <span>Password</span>
            <input type="password" v-model="password"/>
        </label>
        <label class="form-control">
            <span>Password Confirmation</span>
            <input type="password" v-model="cpassword"/>
        </label>
        <div class="flex flex-row justify-between items-center w-full">
            <router-link :to="{name:'home'}" class="block btn btn-blue">Back</router-link>
            <button type="submit" class="block btn btn-orange">Create My Account</button>
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