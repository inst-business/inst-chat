'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import useModal from '@/hooks/ModalStore'
import ActionToolTip from '@/components/shared/ActionToolTip'

const SideBarAction = () => {

  const { onOpen } = useModal()

  return (
    <div>
      <ActionToolTip
        side={'right'}
        align={'center'}
        label={'Add a server'}
      >
        <button
          className={'group flex items-center'}
          onClick={() => onOpen('createServer')}
        >
          <div
            className={'flex mx-3 h-12 w-12 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500'}
          >
            <Plus
              className={'group-hover:text-white transition text-emerald-500'}
              size={24}
            />
          </div>
        </button>
      </ActionToolTip>
    </div>
  )
}

export default SideBarAction