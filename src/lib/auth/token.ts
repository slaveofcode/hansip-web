import { useCookies } from "vue3-cookies";

interface TokenInfo {
  accessToken: string
  refreshToken: string
  accessExp: Date
  refreshExp: Date
}

const { cookies } = useCookies()

export const clearToken = () => {
  cookies.remove('access_token')
  cookies.remove('refresh_token')
}

export const setToken = (tokenInfo: TokenInfo) => {
  cookies.set('access_token', tokenInfo.accessToken, new Date(tokenInfo.accessExp))
  cookies.set('refresh_token', tokenInfo.refreshToken, new Date(tokenInfo.refreshExp))
};

export const getToken = (): string => {
  return cookies.get('access_token')
}
