import {createAuth}          from '@websanova/vue-auth';
import driverAuthBearer      from '@websanova/vue-auth/src/drivers/auth/bearer.js';
import driverHttpAxios       from '@websanova/vue-auth/src/drivers/http/axios.1.x.js';
import driverRouterVueRouter from '@websanova/vue-auth/src/drivers/router/vue-router.2.x.js';


export default (app: any) => {
    app.use(createAuth({
        plugins: {
            http: app.axios,
            router: app.router,
        },
        drivers: {
            http: driverHttpAxios,
            auth: driverAuthBearer,
            router: driverRouterVueRouter,
        },
        options: {
            rolesKey: 'type',
            stores: ['cookie'],
            notFoundRedirect: { name: 'error' },
            forbiddenRedirect: { name: 'login-account' },
            authRedirect: { name: 'login-account' }
        }
    }));
}