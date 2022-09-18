<script lang="ts" setup>
import { reactive, ref, toRef } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount } from '@vue/runtime-core'
import { useStore as getFileStore } from '@/stores/file'
import { useStore as getAccountStore } from '@/stores/account'
import Modal from '@/components/Modal.vue'
import { showPopupInfo } from '@/lib/popup'

const route = useRoute()
const router = useRouter()
const fileStore = getFileStore()
const accountStore = getAccountStore()

if (!accountStore.isAuthenticated) {
    accountStore.validateAuth().catch()
}

const data = reactive({
    code: (route.params.code) as string,
    files: [],
})

const code = toRef(data, 'code')
const files = toRef(data, 'files')
const showModalPrompt = ref(false)
const needDownloadPassword = ref(false)
const needLoginPassword = ref(false)

onBeforeMount(async () => {
    const res = await fileStore.viewFiles(code.value)
    if (!res) {
        router.push({ name: 'error' })
    }

    if (res.isNeedLogin && !accountStore.isAuthenticated) {
        router.push({
            name: 'login-account',
            query: {
                url: route.fullPath,
            },
        })
        return
    }

    if (!res.isAllowed) {
        showPopupInfo('You\'re not allowed to open this file')
        return
    }

    showModalPrompt.value = res.isProtected || res.isNeedLogin
    needDownloadPassword.value = res.isProtected
    needLoginPassword.value = res.isNeedLogin
    if (!res.isProtected && !res.isNeedLogin) {
        files.value = res.files
    }
})

const downloadPass = ref()
const accountPass = ref()
const showProtectedFiles = async () => {
    const { ok, message, files: downloadFiles } = await fileStore.viewProtectedFiles(code.value, {
        pagePassword: downloadPass.value,
        accountPassword: accountPass.value,
    })

    if (!ok) {
        showPopupInfo(message)
        return
    }

    files.value = downloadFiles
    showModalPrompt.value = false
}

const fetchFiles = async () => {
    await fileStore.downloadFiles(code.value, {
        pagePassword: downloadPass.value,
        accountPassword: accountPass.value,
    })
}
</script>

<template>
    <div class="container flex flex-col w-full">
        <h1 class="text-3xl mb-3">Download the Files</h1>
        <div class="file-list w-full bg-gray-800 flex flex-col justify-center items-start overflow-y-auto">
            <ul class="flex flex-col justify-start items-start">
                <li class="mb-2" v-for="file in (files as any[])" :key="file.fileId">
                    <span class="text-green-500 font-bold">></span>
                    <span class="ml-1">{{file.fileName}}</span>
                </li>
            </ul>
        </div>
        <div class="flex flex-row justify-center items-center w-full mt-3">
            <button :disabled="files.length <= 0"  @click.prevent="fetchFiles" class="block btn" :class="{'btn-orange': files.length > 0, 'btn-disable': files.length <= 0}">Download</button>
        </div>
    </div>
    <Modal :show="showModalPrompt" :no-close-button="true">
		<form @submit.prevent="showProtectedFiles" class="flex flex-col justify-start items-start mt-3">
			<label v-if="needDownloadPassword" class="form-control textbox">
                <span>Download Page Password</span>
                <input type="password" v-model="downloadPass"/>
            </label>
            <label v-if="needLoginPassword" class="form-control textbox">
                <span>Your Account Password</span>
                <input type="password" v-model="accountPass"/>
            </label>
			<div class="flex flex-row justify-end items-center w-full">
				<button type="submit" class="block btn btn-orange">Show File</button>
			</div>
		</form>
	</Modal>
</template>

<style lang="stylus" scoped>
.container {
    max-width: 600px;
}
.file-list {
    min-height: 20rem;
    max-height: 25rem;
    @apply px-8 py-8;
}
</style>