<script lang="ts" setup>
import { ref } from "@vue/reactivity"
import { useRouter } from 'vue-router'
import { useStore as getAccountStore } from '../stores/account'
import { showPopupInfo } from '../lib/popup'

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
        showPopupInfo('All fields are required!')
        return
    }

    if (passwordNotEqual()) {
        showPopupInfo('Password doesn\'t match with confirmation')
        return
    }

    const [registered, msg] = await accountStore.register({
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

    showPopupInfo(msg)
}
</script>

<template>
  <div class="flex flex-col">
    <h1 class="text-3xl mb-3">Create Account</h1>
    <form @submit.prevent="submitForm()" class="form flex flex-col justify-start items-start mt-3">
        <label class="form-control textbox">
            <span>Name</span>
            <input type="name" v-model="name"/>
        </label>
        <label class="form-control textbox">
            <span>My Alias</span>
            <input type="alias" v-model="alias"/>
        </label>
        <div class="block border-0 border-b border-indigo-500 w-full my-3"></div>
        <label class="form-control textbox">
            <span>Email Address</span>
            <input type="email" v-model="email"/>
        </label>
        <label class="form-control textbox">
            <span>Password</span>
            <input type="password" v-model="password"/>
        </label>
        <label class="form-control textbox">
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
