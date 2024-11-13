import { create } from 'zustand'

type State = {
    userId: string
    userNick: string
    old: boolean
}

type Action = {
    setUser: (state: State) => void
    setOld: (old: boolean) => void
}

export const useZlbStore = create<State & Action>((set) => ({
    userId: '',
    userNick: '',
    old: false,
    setOld: (old) => {
        set({
            old
        })
    },
    setUser: (state) => {
        set({
            userId: state.userId,
            userNick: state.userNick
        })
    }
}))
