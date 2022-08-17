<script lang="ts" setup>
import { reactive, ref, toRef, watchEffect } from 'vue'
import { addDays, formatISO } from 'date-fns'
import { useStore as getFileStore, FileGroupParam, BundleFileGroupParam } from '../stores/file'
import DropZone from './DropZone.vue'
import FilePreview from './FilePreview.vue'
import useFileList from '../lib/file/file-list'
import createUploader from '../lib/file/file-uploader'
import Modal from '../components/Modal.vue'

const { files, addFiles, removeFile, resetFiles } = useFileList()
const data = reactive({
	showModalConfirm: false,
	showModalResult: false,
	downloadURL: null
})

const showModalConfirm = toRef(data, 'showModalConfirm')
const showModalResult = toRef(data, 'showModalResult')
const downloadURL = toRef(data, 'downloadURL')

function onInputChange(e: any) {
	addFiles(e.target.files)
	e.target.value = null // reset so that selecting the same file again will still cause it to fire this change
}

const syncShowModalConfirmClosed = () => showModalConfirm.value = false
const syncShowModalResultClosed = () => showModalResult.value = false

const confirmUpload = () => {
	showModalConfirm.value = true;
}

const zipPassword = ref()
const cZipPassword = ref()
const downloadPass = ref()
const cdownloadPass = ref()
const useProtectedView = ref()
const submitFileGroupForm = async () => {
	const MIN_LENGTH_PASS = 6

	if (['', undefined].includes(zipPassword.value) || ['', undefined].includes(cZipPassword.value)) {
		alert('ZIP Password cannot be empty')
		return
	}
	
	if (zipPassword.value != cZipPassword.value) {
		alert('ZIP Password doesn\'t match')
		return
	}

	if (zipPassword.value.length < MIN_LENGTH_PASS) {
		alert('Minimum length ZIP password is 6 digit, please change.')
		return
	}

	if (useProtectedView.value) {
		if (['', undefined].includes(downloadPass.value) || ['', undefined].includes(cdownloadPass.value)) {
			alert('Download page password cannot be empty')
			return
		}
		if (downloadPass.value != cdownloadPass.value) {
			alert('Download page password doesn\'t match')
			return
		}


		if (downloadPass.value.length < MIN_LENGTH_PASS) {
			alert('Minimum length download page password is 6 digit, please change.')
			return
		}
	}

	const fileStore = getFileStore()
	const fileGroupParam: FileGroupParam = {
		archiveType: 'ZIP',
	}

	const fileGroupId = await fileStore.getFileGroupId(fileGroupParam)
	if (!fileGroupId) {
		alert('Unable to continue upload, try again in a moment')
		return
	}

	const { uploadFiles } = createUploader(fileGroupId, '/internal/files/upload')
	const results = await uploadFiles(files.value)

	let allOk = true
	for (const res of results) {
		allOk = allOk && res.status === 201
	}

	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
	const bundleParams: BundleFileGroupParam = {
		fileGroupId,
		passcode: zipPassword.value,
		expiredAt: formatISO(addDays(new Date(), 30)),
	}

	if (useProtectedView.value) {
		bundleParams.downloadPassword = downloadPass.value
	}

	const bundle = await fileStore.bundleFileGroup(bundleParams)
	if (bundle) {
		const { downloadUrl, expiredAt } = bundle
		showModalConfirm.value = false

		downloadURL.value = downloadUrl
		showModalResult.value = true
		resetFiles()
		return
	}

	showModalConfirm.value = false
	showModalResult.value = true
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
            <button :disabled="files.length <= 0"  @click.prevent="confirmUpload" class="block btn" :class="{'btn-orange': files.length > 0, 'btn-disable': files.length <= 0}">Upload</button>
        </div>
    </div>
	<Modal :show="showModalResult" @on-modal-closed="syncShowModalResultClosed">
		<div v-if="downloadURL">
			File Uploaded
			Download URL: <a :href="downloadURL" target="_blank">{{ downloadURL }}</a>
		</div>
		<div v-else>
			Unable to process files
		</div>
	</Modal>
	<Modal :show="showModalConfirm" @on-modal-closed="syncShowModalConfirmClosed">
		<form @submit.prevent="submitFileGroupForm" class="flex flex-col justify-start items-start mt-3">
			<label class="form-control textbox">
				<span>ZIP Password</span>
				<input type="password" v-model="zipPassword" />
			</label>
			<label class="form-control textbox">
				<span>Repeat ZIP Password</span>
				<input type="password" v-model="cZipPassword"/>
			</label>
			<label class="form-control checkbox">
				<input type="checkbox" v-model="useProtectedView" />
				<span class="ml-2">Protect Download Page</span>
			</label>
			<div v-if="useProtectedView">
				<label class="form-control textbox">
					<span>Download Password</span>
					<input type="password" v-model="downloadPass"/>
				</label>
				<label class="form-control textbox">
					<span>Repeat Password</span>
					<input type="password" v-model="cdownloadPass"/>
				</label>
			</div>
			<div class="flex flex-row justify-between items-center w-full">
				<button @click="showModalConfirm = false" class="block btn btn-blue">Cancel</button>
				<button type="submit" class="block btn btn-orange">Start Upload</button>
			</div>
		</form>
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
</style>