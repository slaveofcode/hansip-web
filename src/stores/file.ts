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
    userIds?: string[]
}

export interface DownloadProtectedParam {
    accountPassword?: string
    pagePassword?: string
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
                const { isProtected, isNeedLogin, data } = res.data
                return {
                    isProtected,
                    isNeedLogin,
                    files: data.files,
                }
            }

            return false
        },
        async viewProtectedFiles(code: string, params: DownloadProtectedParam): Promise<any | boolean>  {
            const res = await axios.post(`/view/${code}`, {
                downloadPassword: params.pagePassword,
                accountPassword: params.accountPassword
            })

            if (res.status === 200) {
                const { data } = res.data
                return {
                    files: data.files,
                }
            }

            return false
        },
        async downloadInfo(code: string, password: string): Promise<[boolean, any]> {
            const res = await axios.post(`/download/info/${code}`, {
                password,
            })

            if (res.status === 200) {
                return [true, res.data]
            }

            return [false, null]
        },
        async downloadFiles(code: string, params: DownloadProtectedParam): Promise<[boolean, any] | undefined> {
            const res = await axios.post(`/download/do/${code}`, {
                downloadPassword: params.pagePassword,
                accountPassword: params.accountPassword
            }, { responseType: 'blob' })

            let filename = 'files.zip'
            if (res.headers['content-disposition'] && res.headers['content-disposition'].indexOf('attachment') !== -1) {
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(res.headers['content-disposition']);
                if (matches != null && matches[1]) { 
                  filename = matches[1].replace(/['"]/g, '');
                }
            }
            
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename); 
            document.body.appendChild(link);

            link.click();

            return undefined;
        }
    }
})
