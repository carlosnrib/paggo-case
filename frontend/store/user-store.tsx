import { createStore } from 'zustand/vanilla'

export type UserState = {
  userId: string | null
}

export type UserActions = {
  setUserId: (id: string) => void
  clearUserId: () => void
}

export type UserStore = UserState & UserActions

export const defaultInitState: UserState = {
  userId: null,
}

export const createUserStore = (
  initState: UserState = defaultInitState,
) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setUserId: (id: string) => set({ userId: id }),
    clearUserId: () => set({ userId: null }),
  }))
}
