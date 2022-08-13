<script lang="ts" setup>
import { ref } from "@vue/reactivity"
import { useRouter } from 'vue-router'
import { useStore as getAccountStore } from '../stores/account'

const router = useRouter()
const accountStore = getAccountStore()

const name = ref()
const alias = ref()
const email = ref()
const password = ref();
const cpassword = ref();

const allFieldsFilled = () => {
    return !!name.value && !!alias.value && !!email.value && !!password.value && !!cpassword.value
}

const passwordNotEqual = () => password.value != cpassword.value

const submitForm = async () => {
    if (!allFieldsFilled()) {
        alert('All fields are required!')
        return
    }

    if (passwordNotEqual()) {
        alert('Password doesn\'t match with confirmation')
        return
    }

    const registered = await accountStore.register({
        name: name.value,
        alias: alias.value,
        email: email.value,
        password: password.value,
        cpassword: cpassword.value,
    })

    if (registered) {
        router.push({ name: 'home' })
        return
    }

    alert('Failed register account!')
}


</script>

<template>
  <div class="flex flex-col">
    <h1 class="text-3xl">Create Account</h1>
    <form @submit.prevent="submitForm()" class="flex flex-col justify-start items-start mt-3">
        <label class="form-control">
            <span>Name</span>
            <input type="name" v-model="name"/>
        </label>
        <label class="form-control">
            <span>My Alias</span>
            <input type="alias" v-model="alias"/>
        </label>
        <div class="block  border-b border-indigo-600 w-full my-3"></div>
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
        <div class="flex flex-row justify-between items-center w-full mt-3">
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