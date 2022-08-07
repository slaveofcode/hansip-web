<script lang="ts" setup>
import DropZone from './DropZone.vue'
import FilePreview from './FilePreview.vue'
import useFileList from '../compositions/file-list'
import createUploader from '../compositions/file-uploader'

const { files, addFiles, removeFile } = useFileList()

function onInputChange(e) {
	addFiles(e.target.files)
	e.target.value = null // reset so that selecting the same file again will still cause it to fire this change
}

const { uploadFiles } = createUploader('http://localhost:8080/upload')
</script>

<template>
    <div class="flex flex-col">
        <h1 class="text-3xl mb-3">File Sharing</h1>
        <DropZone class="drop-area" @files-dropped="addFiles" #default="{ dropZoneActive }">
            <label for="file-input">
				<span v-if="dropZoneActive">
					<span>Drop files...</span>
				</span>
				<span v-else>
					<span>Drag Files Here</span>
					<span class="smaller">
						or <strong><em>click here</em></strong> to select files
					</span>
				</span>

				<input type="file" id="file-input" multiple @change="onInputChange" />
			</label>
			<ul class="image-list" v-show="files.length">
				<FilePreview v-for="file of files" :key="file.id" :file="file" tag="li" @remove="removeFile" />
			</ul>
        </DropZone>
        <div class="flex flex-row justify-between items-center w-full mt-3">
            <router-link :to="{name:'home'}" class="block btn btn-blue">Back</router-link>
            <button @click.prevent="uploadFiles(files)" class="block btn btn-orange">Upload</button>
        </div>
    </div>
</template>

<style scoped lang="stylus">
.drop-area {
	width: 100%;
	max-width: 800px;
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
</style>