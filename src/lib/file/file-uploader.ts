import axios from 'axios'

export async function uploadFile(fileGroupId: string, path: string, file: any) {
	// set up the request data
	let formData = new FormData()
	formData.append('fileGroupId', fileGroupId)
	formData.append('file', file.file)

	// track status and upload file
	file.status = 'loading'
	// let response = await fetch(url, { method: 'POST', body: formData })
	const response = await axios.post(path, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		}
	})

	// change status to indicate the success of the upload request
	file.status = response.status === 201

	return response
}

export function uploadFiles(fileGroupId: string, path: string, files: any[]) {
	return Promise.all(files.map((file) => uploadFile(fileGroupId, path, file)))
}

export default function createUploader(fileGroupId: string, path: string) {
	return {
		uploadFile: function (file: any) {
			return uploadFile(fileGroupId, path, file)
		},
		uploadFiles: function (files: any) {
			return uploadFiles(fileGroupId, path, files)
		},
	}
}