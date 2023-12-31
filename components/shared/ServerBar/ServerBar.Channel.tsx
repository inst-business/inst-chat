'use client'

import { FC } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  LucideIcon, Hash, Mic, Video, Edit, Trash, Lock
} from 'lucide-react'
import { Channel, Server, MemberRole, ChannelType } from '@prisma/client'
import { GV } from '@/config/glob'
import { cn } from '@/lib/utils'
import useModal, { ModalType } from '@/hooks/ModalStore'
import ActionToolTip from '@/components/shared/ActionToolTip'

type TServerBarChannelProps = {
  channel: Channel
  server: Server
  role?: MemberRole
}

const iconMap: Record<ChannelType, LucideIcon> = {
  'TEXT': Hash,
  'AUDIO': Mic,
  'VIDEO': Video,
}

const ServerBarChannel: FC<TServerBarChannelProps> = ({
  channel, server, role
}) => {

  const params = useParams()
  const router = useRouter()
  const { onOpen } = useModal()

  const Icon = iconMap[channel.type]

  const handleVisitChannel = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
  }

  const handlePerformAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation()
    onOpen(action, { server, channel })
  }

  return (
    <button
      className={cn(
        'group w-full px-2 py-2 mb-1 flex items-center gap-x-2 rounded-md hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition',
        params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
      onClick={() => handleVisitChannel()}
    >
      <Icon className={'h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400'} />
      <p className={cn(
        'text-sm line-clamp-1 font-semibold text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
        params?.channelId === channel.id && 'text-primary dark:text-zinc-200 dark:group-hover:text-white'
      )}>
        {channel.name}
      </p>
      {channel.name !== GV.DEFAULT_CHANNEL && role !== MemberRole.GUEST && (
        <div className={'ml-auto flex items-center gap-x-2'}>
          <ActionToolTip label={'Edit'}>
            <Edit
              className={'h-4 w-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zince-400 dark:hover:text-zinc-300 transition'}
              onClick={e => handlePerformAction(e, 'editChannel')}
            />
          </ActionToolTip>
          <ActionToolTip label={'Delete'}>
            <Trash
              className={'h-4 w-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zince-400 dark:hover:text-zinc-300 transition'}
              onClick={e => handlePerformAction(e, 'deleteChannel')}
            />
          </ActionToolTip>
        </div>
      )}
      {channel.name === GV.DEFAULT_CHANNEL && (
        <Lock className={'h-4 w-4 ml-auto text-zinc-500 dark:text-zinc-400'} />
      )}
    </button>
  )
}

export default ServerBarChannel