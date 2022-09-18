import axios from "axios";
import mem from "mem";
import { useCookies } from 'vue3-cookies'

export const refreshToken = async (token: string) => {
  try {
    const { cookies } = useCookies()
    const res = await axios.post("/auth/refresh-token", {
      token,
    });

    if (res.status === 200 && res.data.data) {
      cookies.remove('access_token')
      cookies.remove('refresh_token')

      const { accessToken, refreshToken, exp, expRefresh } = res.data.data;
      cookies.set('access_token', accessToken, new Date(exp))
      cookies.set('refresh_token', refreshToken, new Date(expRefresh))

      return accessToken
    }
  } catch (err) {
    console.log('Refresh token failed:', err)
  }

  return false
};

export const memoizeRefreshToken = mem(refreshToken, {
  maxAge: 3000,
})