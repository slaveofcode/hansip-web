import { createPinia } from 'pinia'

export default (app: any) => {
    const pinia = createPinia()
    app.use(pinia)
}