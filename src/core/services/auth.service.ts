import { create } from 'zustand'
import { SysUserVO } from './login.service'
import { createProxyStorage } from 'stokado'

type State = {
    token: string
    user: Partial<SysUserVO>
    authList: string[]
}
const storage = createProxyStorage(localStorage)

type Action = {
    setToken: (token: string) => void
    setAuth: (auth: string[]) => void
    setUser: (user: SysUserVO) => void
}

export const useAuthStore = create<State & Action>((set) => ({
    token: storage.token,
    user: {},
    authList: [],
    setToken: (token) => {
        storage.setExpires('token', 1000 * 60 * 60 * 3)
        storage.token = token

        set({ token: token })
    },
    setAuth: (auth) => {
        set({ authList: auth })
    },
    setUser: (user) => {
        set({ user })
    }
}))
