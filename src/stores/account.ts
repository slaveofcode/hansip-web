
import { defineStore } from 'pinia'
import axios from 'axios'
import { useCookies } from 'vue3-cookies'
import { clearToken, setToken } from '../lib/auth/token';

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
        reloadAuthStatus() {
            this.isLoggedIn = Boolean(cookies.get('access_token'))
        },
        logout() {
            clearToken()
            this.reloadAuthStatus()
        }
    },
})