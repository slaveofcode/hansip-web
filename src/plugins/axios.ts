import axios from "axios";
import { useCookies } from "vue3-cookies";
import { memoizeRefreshToken } from "../lib/auth/refresh_token";

const { cookies } = useCookies();

axios.defaults.baseURL = "http://localhost:8080"; // TODO: change on prod
axios.defaults.validateStatus = () => true;

axios.interceptors.request.use(
  async (config) => {
    const session = JSON.parse(cookies.get('access_token'));

    if (session?.accessToken) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${session?.accessToken}`,
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

      config.sent = true;
      const newAccessToken = await memoizeRefreshToken(refreshToken);

      if (newAccessToken) {
        config.headers = {
          ...config.headers,
          authorization: `Bearer ${newAccessToken}`,
        };
      }

      return axios(config);
    }
    return Promise.reject(error);
  }
);

export default (app: any) => {
  app.axios = axios;
  app.$http = axios;

  app.config.globalProperties.axios = axios;
  app.config.globalProperties.$http = axios;
};
