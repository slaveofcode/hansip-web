<template>
	<component :is="tag" class="file-preview">
		<button @click="$emit('remove', file)" class="close-icon">&times;</button>
		<img v-if="isSupportedExt(getExt(file.file.name))" :src="`/filetypes/${getExt(file.file.name)}-icon.png`" class="rounded-xl bg-gray-200 p-2 text-gray-700" />
		<img v-else :src="file.url" :alt="file.file.name" :title="file.file.name" class="rounded-xl bg-gray-200 p-2 text-gray-700" />
		<span class="status-indicator loading-indicator" v-show="file.status == 'loading'">In Progress</span>
		<span class="status-indicator success-indicator" v-show="file.status == true">Uploaded</span>
		<span class="status-indicator failure-indicator" v-show="file.status == false">Error</span>
	</component>
</template>

<script lang="ts" setup>
defineProps({
	file: { type: Object, required: true },
	tag: { type: String, default: 'li' },
})
defineEmits(['remove'])

const isSupportedExt = (ext: string): boolean => {
	return [
	'ai',
	'aif',
	'ajax',
	'api',
	'apk',
	'app',
	'aspx',
	'avi',
	'avif',
	'bak',
	'bat',
	'bin',
	'bmp',
	'c',
	'++',
	'cab',
	'cad',
	'cdr',
	'cer',
	'class',
	'crx',
	'cs',
	'csr',
	'css',
	'csv',
	'deb',
	'dll',
	'dmp',
	'doc',
	'docx',
	'eps',
	'exe',
	'fla',
	'gbr',
	'ged',
	// 'gif',
	'gpx',
	'html',
	'icns',
	'ico',
	'ini',
	'iso',
	'jar',
	'jpeg',
	// 'jpg',
	'js',
	'json',
	'jsp',
	'kml',
	'log',
	'mid',
	'mim',
	'mov',
	'mp3',
	'mp4',
	'mpeg',
	'mpg',
	'msi',
	'obj',
	'ods',
	'odt',
	'otf',
	'part',
	'pdf',
	'php',
	'pkg',
	'pl',
	// 'png',
	'ppt',
	'prf',
	'psd',
	'rar',
	'rpm',
	'rss',
	'rtf',
	'sdk',
	'sql',
	'svg',
	'swift',
	'tiff',
	'tmp',
	'ttf',
	'txt',
	'vb',
	'vcf',
	'vsd',
	'wav',
	// 'webp',
	'wmv',
	'wsf',
	'xls',
	'xlsx',
	'yaml',
	'zip',
	].includes(ext)
}

const getExt = (file: string): string => {
	return file.split('.').pop() || file
}
</script>

<style scoped lang="stylus">
.file-preview {
	width: 20%;
	margin: 1rem 2.5%;
	position: relative;
	aspect-ratio: 1/1;
	overflow: hidden;
	img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}
	.close-icon, .status-indicator {
		--size: 20px;
		position: absolute;
		line-height: var(--size);
		height: var(--size);
		border-radius: var(--size);
		box-shadow: 0 0 5px currentColor;
		right: 0.25rem;
		appearance: none;
		border: 0;
		padding: 0;
	}
	.close-icon {
		width: var(--size);
		font-size: var(--size);
		top: 0.25rem;
		cursor: pointer;
		@apply bg-red-500 text-white;
	}
	.status-indicator {
		font-size: calc(0.75 * var(--size));
		bottom: 0.25rem;
		padding: 0 10px;
	}
	.loading-indicator {
		animation: pulse 1.5s linear 0s infinite;
		color: #000;
	}
	.success-indicator {
		background: #6c6;
		color: #040;
	}
	.failure-indicator {
		background: #933;
		color: #fff;
	}
}
@keyframes pulse {
	0% {
		background: #fff;
	}
	50% {
		background: #ddd;
	}
	100% {
		background: #fff;
	}
}
</style>