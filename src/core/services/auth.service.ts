import { create } from 'zustand'
import { createProxyStorage } from 'stokado'
type State = {
    token: string
    user: Partial<any>
}
const storage = createProxyStorage(localStorage)

type Action = {
    setToken: (token: string) => void

    setUser: (user: any) => void
}

export const useAuthStore = create<State & Action>((set) => ({
    token: storage.token,
    user: storage.user || {},

    setToken: (token) => {
        storage.setExpires('token', 1000 * 60 * 60 * 24)
        storage.token = token
        set({ token: token })
    },

    setUser: (user) => {
        storage.setExpires('user', 1000 * 60 * 60 * 24)
        storage.user = user

        set({ user })
    }
}))
