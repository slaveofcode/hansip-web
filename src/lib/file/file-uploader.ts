import axios from 'axios'

export async function uploadFile(fileGroupId: string, path: string, file: any, progressFn: (pct: number) => void) {
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
		},
		onUploadProgress: progressFn,
		// onUploadProgress: (progressEvent) => {
		// 	progressFn(Math.round( (progressEvent.loaded * 100) / progressEvent.total))
		// }
	})

	// change status to indicate the success of the upload request
	file.status = response.status === 201

	return response
}

export function uploadFiles(fileGroupId: string, path: string, files: any[], progressFn: (file: any, pcts: number) => void) {
	const uploads = []

	let i = 0
	for (const file of files) {
		uploads.push(
			uploadFile(fileGroupId, path, file, (progressEvent: any) => {
				const pct = Math.round( (progressEvent.loaded * 100) / progressEvent.total)
				progressFn(file, pct)
			})
		)
	}

	return Promise.all(uploads)
}

export default function createUploader(fileGroupId: string, path: string) {
	return {
		uploadFile: function (file: any, progressFn: (pct: number) => void) {
			return uploadFile(fileGroupId, path, file, progressFn)
		},
		uploadFiles: function (files: any, progressFn: (file: any, pct: number) => void) {
			return uploadFiles(fileGroupId, path, files, progressFn)
		},
	}
}