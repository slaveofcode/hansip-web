import { defineStore } from 'pinia'
import axios from 'axios'
import { useCookies } from 'vue3-cookies'
import { clearToken, getToken, setToken } from '../lib/auth/token';

const { cookies } = useCookies()

interface RegisterAccountParam {
    name: string;
    alias: string;
    email: string;
    password: string;
    cpassword: string;
}

interface LoginAccountParam {
    email: string;
    password: string;
}

export const useStore = defineStore('account', {
    state: () => ({
        isLoggedIn: false,
    }),
    getters: {
        isAuthenticated(): boolean {
            return this.isLoggedIn
        },
    },
    actions: {
        async register(params: RegisterAccountParam) {
            const res = await axios.post('/auth/register', params)
            if (res.status === 201) {
                return true
            }

            return false
        },
        async login(params: LoginAccountParam) {
            const res = await axios.post('/auth/login', params)
            if (res.status === 200) {
                const {
                    data
                } = res.data

                const {
                    accessToken,
                    refreshToken,
                    exp,
                    expRefresh,
                } = data

                setToken({
                    accessToken,
                    refreshToken,
                    accessExp: exp,
                    refreshExp: expRefresh,
                })
                return true
            }

            return false
        },
        async validateAuth() {
            const token = getToken()
            if (!token) {
                this.isLoggedIn = false
                return this.isLoggedIn
            }

            const res = await axios.get('/auth/check')
            if (res.status != 200) {
                this.isLoggedIn = false
                return this.isLoggedIn
            }

            this.isLoggedIn = true
            return this.isLoggedIn
        },
        getToken() {
            return getToken()
        },
        logout() {
            clearToken()
        }
    },
})