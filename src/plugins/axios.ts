import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

export default (app: any) => {
    app.axios = axios;
    app.$http = axios;

    app.config.globalProperties.axios = axios;
    app.config.globalProperties.$http = axios;
}