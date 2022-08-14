import { defineStore } from 'pinia'
import axios from 'axios'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()

export interface FileGroupParam {
    archiveType: string
    passcode: string
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
    }
})
