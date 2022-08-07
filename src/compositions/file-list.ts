import { ref } from 'vue'

export default function () {
	const files: any = ref([])

	function addFiles(newFiles: any[]) {
		let newUploadableFiles: any[] = [...newFiles]
            .map((file) => new UploadableFile(file))
            .filter((file: any) => !fileExists(file.id))
		files.value = files.value.concat(newUploadableFiles)
	}

	function fileExists(otherId: string) {
		return files.value.some(({ id }: any) => id === otherId)
	}

	function removeFile(file: any) {
		const index = files.value.indexOf(file)

		if (index > -1) files.value.splice(index, 1)
	}

	return { files, addFiles, removeFile }
}

class UploadableFile {
    file: any;
    id: string;
    url: string;
    status: any;

	constructor(file: any) {
		this.file = file
		this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`
		this.url = URL.createObjectURL(file)
		this.status = null
	}
}
