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
        }
    }
})
