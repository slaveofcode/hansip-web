import { defineStore } from 'pinia'
import axios from 'axios'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()

export interface FileGroupParam {
    archiveType: string
}

export interface BundleFileGroupParam {
    fileGroupId: string
    passcode: string
    expiredAt: string
    downloadPassword?: string
}

export const useStore = defineStore('file', {
    actions: {
        async getFileGroupId(params: FileGroupParam) {
            const res = await axios.post('/internal/files/request-group', params)
            if (res.status === 201) {
                const { data } = res.data
                return data.fgId
            }

            return null
        },
        async bundleFileGroup(params: BundleFileGroupParam) {
            const res = await axios.post('/internal/files/bundle-group', params)
            if (res.status === 201) {
                const { data } = res.data
                return {
                    fgId: data.fgId,
                    expiredAt: data.expiredAt,
                    downloadUrl: data.downloadUrl
                }
            }

            return false
        },
        async viewFiles(code: string): Promise<any | boolean> {
            const res = await axios.get(`/view/${code}`)
            if (res.status === 200) {
                const { isProtected, data } = res.data
                return {
                    isProtected,
                    files: data.files,
                }
            }

            return false
        },
        async viewProtectedFiles(code: string, password: string): Promise<any | boolean>  {
            const res = await axios.post(`/view/${code}`, {
                password,
            })
            if (res.status === 200) {
                const { data } = res.data
                return {
                    files: data.files,
                }
            }

            return false
        },
        async downloadFiles(code: string, password: string) {
            const res = await axios.post(`/download/${code}`, {
                password,
            }, { responseType: 'blob' })
        }
    }
})
