<script lang="ts" setup>
import { reactive, ref, toRef } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import { useStore as getFileStore } from '../stores/file'
import Modal from '../components/Modal.vue'
import { onBeforeMount } from '@vue/runtime-core'

const route = useRoute()
const router = useRouter()
const fileStore = getFileStore()
const data = reactive({
    code: (route.params.code) as string,
    files: [],
})

const code = toRef(data, 'code')
const files = toRef(data, 'files')
const showModalPrompt = ref(false)

onBeforeMount(async () => {
    const res = await fileStore.viewFiles(code.value)
    if (!res) {
        router.push({ name: 'error' })
    }

    showModalPrompt.value = res.isProtected
    if (!res.isProtected) {
        files.value = res.files
    }
})

const downloadPass = ref()
const showProtectedFiles = async () => {
    const res = await fileStore.viewProtectedFiles(code.value, downloadPass.value)
    if (!res) {
        alert('Wrong password, try again.')
        return
    }

    files.value = res.files
    showModalPrompt.value = false
}

const fetchFiles = async () => {
    await fileStore.downloadFiles(code.value, downloadPass.value)
}

// fetch info by code
  // has download password ?
    // prompt pass
    // keep pass locally for download
// display
// handle download
  // has download password ?
     // show prompt password
</script>

<template>
    <div class="container flex flex-col w-full">
        <h1 class="text-3xl mb-3">Download the Files</h1>
        <div class="file-list w-full bg-gray-800 flex flex-col justify-center items-start overflow-y-auto">
            <ul class="flex flex-col justify-start items-start">
                <li class="mb-2" v-for="file in files" :key="file.fileId">
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
			<label class="form-control textbox">
                <span>Download Password</span>
                <input type="password" v-model="downloadPass"/>
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