import { Server } from '@prisma/client'
import { create } from 'zustand'

type ModalType = 'createServer' | 'invite' | 'editServer' | 'members'

interface IModalData {
  server?: Server
}

interface ModalStore {
  type: ModalType | null
  data: IModalData
  isOpen: boolean
  onOpen: (type: ModalType, data?: IModalData) => void
  onClose: () => void
}

const useModal = create<ModalStore>(set => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}))

export {
  type ModalType,
}

export default useModal