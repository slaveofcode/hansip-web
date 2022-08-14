import { createPinia } from 'pinia'
import { useStore as getAccountStore } from './account'

export default (app: any) => {
    const pinia = createPinia()

    // initial setup login state
    const accountStore = getAccountStore(pinia)
    accountStore.validateAuth()

    app.use(pinia)
}