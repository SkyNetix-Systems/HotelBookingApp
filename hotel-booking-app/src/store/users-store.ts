import { IUser } from '@/interfaces'
import { create } from 'zustand'



export interface UsersStore {
  loggedInUser: IUser | null
  setLoggedInUser: (user: IUser | null) => void
}

export const useUsersStore = create<UsersStore>((set) => ({
  loggedInUser: null,
  setLoggedInUser: (user) => set({ loggedInUser: user }),
}))
