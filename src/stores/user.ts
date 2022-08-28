import { defineStore } from 'pinia'
import axios from 'axios'

interface UserState {
    queryResults: any[];
}

export const useStore = defineStore('user', {
    state: (): UserState => ({
        queryResults: [],
    }),
    getters: {
        querySearchResults(): any[] {
            return this.queryResults
        }
    },
    actions: {
        async querySearch(query: string) {

            const { status, data } = await axios.get('/internal/users/query', {
                params: {
                    q: query,
                },
            })

            if (status === 200) {
                console.log(data.data.users)
                this.queryResults = data.data.users
                return true
            }

            return false
        }
    }
})