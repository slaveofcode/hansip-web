import axios from "axios";
import mem from "mem";
import { useCookies } from 'vue3-cookies'

export const refreshToken = async (token: string) => {
  const { cookies } = useCookies()
  const res = await axios.post("/auth/refresh-token", {
    token,
  });

  if (res.status === 201) {
    cookies.remove('access_token')
    cookies.remove('refresh_token')

    const { accessToken, refreshToken, exp, expRefresh } = res.data;
    cookies.set('access_token', accessToken, new Date(exp))
    cookies.set('refresh_token', refreshToken, new Date(expRefresh))

    return accessToken
  }

  return false
};

export const memoizeRefreshToken = mem(refreshToken, {
  maxAge: 5000,
})