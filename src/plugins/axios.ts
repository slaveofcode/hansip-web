import axios from "axios";
import { useCookies } from "vue3-cookies";
import { memoizeRefreshToken } from "@/lib/auth/refresh_token";
import { setToken } from "@/lib/auth/token";

const { cookies } = useCookies();

axios.defaults.baseURL = "http://localhost:8080"; // TODO: change on prod
axios.defaults.validateStatus = (status) => true; // disable all error throw from status code

axios.interceptors.request.use(
  async (config) => {
    const accessToken = cookies.get('access_token');

    if (accessToken) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${accessToken}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;

    if (error?.response?.status === 401 && !config?.sent) {
      const refreshToken = cookies.get('refresh_token')
      if (!refreshToken) {
        return Promise.reject(error)
      }

      try {
        config.sent = true;
        console.log('start refresh token:')
        const newAccessToken = await memoizeRefreshToken(refreshToken);

        if (newAccessToken) {
          config.headers = {
            ...config.headers,
            authorization: `Bearer ${newAccessToken}`,
          };

          return axios(config);
        }
      } catch (err) {
        console.log('Error refresh token:', err)
      }

      cookies.remove('access_token');
      cookies.remove('refresh_token');
    }

    console.log('abc')
    
    return Promise.reject(error);
  }
);

export default (app: any) => {
  app.axios = axios;
  app.$http = axios;

  app.config.globalProperties.axios = axios;
  app.config.globalProperties.$http = axios;
};
