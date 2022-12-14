<script lang="ts" setup>
import { computed, reactive, ref, toRef, watch, watchEffect } from 'vue'
import { addDays, formatISO } from 'date-fns'
// @ts-ignore
import VueTagsInput from '@sipec/vue3-tags-input';
import IconCheckCirleFilled from '~icons/ant-design/check-circle-filled'
import IconCloseCircleFilled from '~icons/ant-design/close-circle-filled'
import { useStore as getFileStore, FileGroupParam, BundleFileGroupParam } from '@/stores/file'
import { useStore as getUserStore } from '@/stores/user'
import DropZone from './DropZone.vue'
import FilePreview from './FilePreview.vue'
import useFileList from '@/lib/file/file-list'
import createUploader from '@/lib/file/file-uploader'
import Modal from '@/components/Modal.vue'
import { showPopupInfo } from '@/lib/popup'

const fileStore = getFileStore()
const userStore = getUserStore()

const { files, addFiles, removeFile, resetFiles } = useFileList()
const data = reactive({
	showModalConfirm: false,
	showModalResult: false,
	showModalUploadProgress: false,
	uploadFileProgresses: {} as {[key: string]: any},
	downloadURL: null,
	filteredUserContacts: [] as any[],
})

const showModalConfirm = toRef(data, 'showModalConfirm')
const showModalResult = toRef(data, 'showModalResult')
const showModalUploadProgress = toRef(data, 'showModalUploadProgress')
const uploadFileProgresses = toRef(data, 'uploadFileProgresses')
const downloadURL = toRef(data, 'downloadURL')
const filteredUserContacts = toRef(data, 'filteredUserContacts')

const syncShowModalConfirmClosed = () => showModalConfirm.value = false
const syncShowModalResultClosed = () => showModalResult.value = false
const syncShowModalUploadProgressClosed = () => showModalUploadProgress.value = false

const confirmUpload = () => {
	showModalConfirm.value = true;
}

function onInputChange(e: any) {
	addFiles(e.target.files)
	e.target.value = null // reset so that selecting the same file again will still cause it to fire this change
}

const tabShare = ref(true)
const tabSecurity = ref(false)

const userContacts = ref()
const userContactTags = ref([] as any)
const zipPassword = ref()
const cZipPassword = ref()
const downloadPass = ref()
const cdownloadPass = ref()
const useProtectedView = ref()

const resetPassphrase = () => {
	userContacts.value = undefined
	userContactTags.value = []
	zipPassword.value = undefined
	cZipPassword.value = undefined
	downloadPass.value = undefined
	cdownloadPass.value = undefined
	useProtectedView.value = undefined
}

const submitFileGroupForm = async () => {
	const MIN_LENGTH_PASS = 6

	if (['', undefined].includes(zipPassword.value) || ['', undefined].includes(cZipPassword.value)) {
		showPopupInfo('ZIP Password cannot be empty')
		return
	}
	
	if (zipPassword.value != cZipPassword.value) {
		showPopupInfo('ZIP Password doesn\'t match')
		return
	}

	if (zipPassword.value.length < MIN_LENGTH_PASS) {
		showPopupInfo('Minimum length ZIP password is 6 digit, please change.')
		return
	}

	if (useProtectedView.value) {
		if (['', undefined].includes(downloadPass.value) || ['', undefined].includes(cdownloadPass.value)) {
			showPopupInfo('Download page password cannot be empty')
			return
		}
		if (downloadPass.value != cdownloadPass.value) {
			showPopupInfo('Download page password doesn\'t match')
			return
		}


		if (downloadPass.value.length < MIN_LENGTH_PASS) {
			showPopupInfo('Minimum length download page password is 6 digit, please change.')
			return
		}
	}

	const fileGroupParam: FileGroupParam = {
		archiveType: 'ZIP',
	}

	const fileGroupId = await fileStore.getFileGroupId(fileGroupParam)
	if (!fileGroupId) {
		showPopupInfo('Unable to continue upload, try again in a moment')
		return
	}

	showModalConfirm.value = false
	showModalUploadProgress.value = true

	const { uploadFiles } = createUploader(fileGroupId, '/internal/files/upload')

	for (const f of files.value) {
		if (!uploadFileProgresses.value[f.file.name]) {
			uploadFileProgresses.value[f.file.name] = 0
		}
	}

	const results = await uploadFiles(files.value, (file, pct: number) => {
		uploadFileProgresses.value[file.file.name] = pct
	})

	let allOk = true
	for (const res of results) {
		allOk = allOk && res.status === 201
	}

	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
	const bundleParams: BundleFileGroupParam = {
		fileGroupId,
		passcode: zipPassword.value,
		expiredAt: formatISO(addDays(new Date(), 30)),
		userIds: userContactTags.value.map((item: any) => item.id),
	}

	if (useProtectedView.value) {
		bundleParams.downloadPassword = downloadPass.value
	}

	const bundle = await fileStore.bundleFileGroup(bundleParams)
	showModalUploadProgress.value = false
	if (bundle) {
		const { downloadUrl, expiredAt } = bundle
		showModalConfirm.value = false

		downloadURL.value = downloadUrl
		showModalResult.value = true
		resetFiles()
		return
	}

	resetPassphrase()
	showModalResult.value = true
}

let tagDebounce: any
const watchTagInput = watch(userContacts, (newVal) => {
	if (tagDebounce) {
		clearTimeout(tagDebounce);
	}

	tagDebounce = setTimeout(() => {
		userStore
			.querySearch(newVal)
			.then((success) => {
				if(success) {
					filteredUserContacts.value = userStore.querySearchResults.map(
						(item) => ({ id: item.id, text: item.alias, object: item }),
					)
				}
			})
	}, 600);
})

const copyUrl = () => {
	const url = downloadURL.value || ''
    navigator.clipboard.writeText(url).then(() => {
        // Alert the user that the action took place.
        // Nobody likes hidden stuff being done under the hood!
        showPopupInfo('URL Copied!')
    });
}
</script>

<template>
    <div class="flex flex-col w-full">
        <h1 class="text-3xl mb-3">File Sharing</h1>
        <DropZone class="drop-area" @files-dropped="addFiles" #default="{ dropZoneActive }">
            <label for="file-input">
				<div v-if="dropZoneActive">
					<span class="text-yellow-800" :class="{'block mt-32': !files.length}">You can drop the file(s) now...</span>
				</div>
				<div v-else>
					<div v-if="files.length">
						<span>Drag Files Here</span>
						<span class="smaller">
							or <strong class="cursor-pointer"><em>click here</em></strong> to select files
						</span>
					</div>
					<div class="block mt-32" v-if="!files.length">
						<span>Drag Files Here</span>
						<span class="smaller">
							or <strong class="cursor-pointer"><em>click here</em></strong> to select files
						</span>
					</div>
					
				</div>

				<input type="file" id="file-input" multiple @change="onInputChange" />
			</label>
			<ul class="image-list" v-show="files.length">
				<FilePreview v-for="file of files" :key="file.id" :file="file" tag="li" @remove="removeFile" />
			</ul>
        </DropZone>
        <div class="flex flex-row justify-between items-center w-full mt-3">
            <router-link :to="{name:'home'}" class="block btn btn-blue">Back</router-link>
            <button :disabled="files.length <= 0"  @click.prevent="confirmUpload" class="block btn" :class="{'btn-orange': files.length > 0, 'btn-disable': files.length <= 0}">Continue</button>
        </div>
    </div>
	<Modal :show="showModalResult" @on-modal-closed="syncShowModalResultClosed">
		<div  v-if="downloadURL" class="modal-result flex flex-col justify-start items-start">
			<h1 class="text-lg font-bold mb-3">File Successfully Uploaded</h1>
			<ul class="flex flex-col justify-start items-start text-sm mb-3">
				<li class="flex flex-row items-center">
					<IconCheckCirleFilled v-if="userContactTags.length > 0" class="mr-1 -mt-1 text-green-500"/>
					<IconCloseCircleFilled v-if="!userContactTags.length" class="mr-1 -mt-1 text-red-500"/>
					Shared to specific user
				</li>
				<li class="flex flex-row items-center">
					<IconCheckCirleFilled v-if="useProtectedView" class="mr-1 -mt-1 text-green-500"/>
					<IconCloseCircleFilled v-if="!useProtectedView" class="mr-1 -mt-1 text-red-500"/>
					Download page is Protected
				</li>
				<li class="flex flex-row items-center">
					<IconCheckCirleFilled class="mr-1 -mt-1 text-green-500"/> File protected by ZIP password
				</li>
			</ul>
			<div class="bg-gray-700 p-3 rounded-md w-full text-white">
				<p class="text-yellow-300 text-sm font-semibold">
					<a :href="downloadURL" target="_blank" id="download-url">{{ downloadURL }}</a>
					<button class="ml-2 bg-pink-500 text-white py-0 px-1 rounded-md active:bg-orange-500" @click="copyUrl">copy</button>
				</p>
			</div>
		</div>
		<div v-else>
			<h1 class="text-lg font-bold mb-3">Unable to process files</h1>
		</div>
	</Modal>
	<Modal :show="showModalConfirm" @on-modal-closed="syncShowModalConfirmClosed">
		<form @submit.prevent="submitFileGroupForm" class="form flex flex-col justify-start items-start mt-3">
			<ul class="flex flex-row justify-evenly items-center w-full mb-3">
				<li class="form-tab" :class="{'active': tabShare}" @click="tabShare = true;tabSecurity = false">Sharing To</li>
				<li class="form-tab" :class="{'active': tabSecurity}" @click="tabShare = false;tabSecurity = true">Security</li>
			</ul>
			<div class="form-tab-content" :class="{'hidden': !tabShare}">
				<label class="form-control textbox">
					<span class="label">Type User to Share</span>
					<VueTagsInput
						v-model="userContacts"
						:tags="userContactTags"
						:autocomplete-items="filteredUserContacts"
						:add-only-from-autocomplete="true"
						@tags-changed="(tags: any) => userContactTags = tags"
						placeholder="find user..."
					/>
				</label>
				<div class="form-control">
					<ul class="w-full">
						<li class="flex flex-col justify-start items-start bg-blue-100 mb-1 p-2 rounded-md text-sm" v-for="item in userContactTags" :key="item.id">
							<span class="text-orange-600">({{ item.object.alias }})</span>
							<p>{{ item.object.name }}</p>
						</li>
					</ul>
				</div>
				<div class="flex flex-row justify-end items-center w-full">
					<button type="button" class="block btn btn-blue" @click="tabShare = false;tabSecurity = true">Continue</button>
				</div>
			</div>
			<div class="form-tab-content" :class="{'hidden': !tabSecurity}">
				<label class="form-control textbox">
					<span class="label">ZIP Password</span>
					<input type="password" v-model="zipPassword" />
				</label>
				<label class="form-control textbox">
					<span class="label">Repeat ZIP Password</span>
					<input type="password" v-model="cZipPassword"/>
				</label>
				<label class="form-control checkbox">
					<input type="checkbox" v-model="useProtectedView" />
					<span class="ml-2">also protect the <strong>Download Page</strong></span>
				</label>
				<div v-if="useProtectedView" class="w-full">
					<label class="form-control textbox">
						<span class="label">Download Password</span>
						<input type="password" v-model="downloadPass"/>
					</label>
					<label class="form-control textbox">
						<span class="label">Repeat Password</span>
						<input type="password" v-model="cdownloadPass"/>
					</label>
				</div>
				<div class="flex flex-row justify-between items-center w-full">
					<button @click="tabShare = true;tabSecurity = false" type="button" class="block btn btn-blue">Back</button>
					<button type="submit" class="block btn btn-orange">Start Upload</button>
				</div>
			</div>
		</form>
	</Modal>
	<Modal :show="showModalUploadProgress" @on-modal-closed="syncShowModalUploadProgressClosed">
		<h1 class="text-lg font-bold mb-3">Uploading</h1>
		<ul>
			<li class="upload-bar" v-for="(prog, key) in uploadFileProgresses" :key="key">
				<span class="text-xs text-gray-700 font-semibold">{{ key }}</span>
				<div class="w-full bg-gray-200 rounded-full h-2.5 mb-1 dark:bg-gray-700">
					<div class="bg-indigo-500 h-2.5 rounded-full dark:bg-indigo-500" :style="`width: ${prog}%`"></div>
				</div>
				<div class="text-indigo-600 text-center text-xs font-semibold">
					<span>{{prog}}%</span>
				</div>
			</li>
		</ul>
	</Modal>
</template>

<style scoped lang="stylus">
.drop-area {
	width: 100%;
	min-height: 400px;
	margin: 0 auto;
	padding: 50px;
	background: #ffffff55;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	transition: .2s ease;
	&[data-active=true] {
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		background: #ffffffcc;
	}
}

input[type=file]:not(:focus-visible) {
    // Visually Hidden Styles taken from Bootstrap 5
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
}

.image-list {
	@apply flex flex-row flex-wrap;
	li {
		
	}
}

.form {
	min-width: 17rem;
	max-width: 20rem;
}

.form-tab {
	@apply flex-grow cursor-pointer border-b-4 text-gray-500 bg-gray-300 border-gray-500 py-2 px-2 transition-all ease-in delay-100;

	&.active, &:hover {
		@apply border-blue-500 bg-white text-gray-800;
	}

	&:hover {
		@apply border-gray-500;
	}
}

.form-tab-content {
	@apply w-full;
}

.modal-result {
	min-width: 300px;
}

.upload-bar {
	@apply relative mb-1;
	max-width: 400px;
}
</style>