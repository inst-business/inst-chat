import { FC } from 'react'
import { redirect } from 'next/navigation'
import { redirectToSignIn } from '@clerk/nextjs'
import { ChannelType } from '@prisma/client'
import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'
import Chat from '@/components/shared/Chat'
import MediaRoom from '@/components/shared/MediaRoom'

type TChannlIdPageProps = {
  params: {
    serverId: string
    channelId: string
  }
}

const ChannelIdPage: FC<TChannlIdPageProps> = async ({
  params
}) => {

  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    }
  })

  const memeber = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    }
  })

  if (!channel || !memeber) redirect('/')

  return (
    <div className={'h-full flex flex-col bg-white dark:bg-[#313338]'}>
      <Chat.Header
        name={channel.name}
        serverId={channel.serverId}
        type={'channel'}
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <Chat.Messages
            type={'channel'}
            chatId={channel.id}
            name={channel.name}
            member={memeber}
            apiUrl={'/api/messages'}
            socketUrl={'/api/socket/messages'}
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey={'channelId'}
            paramValue={channel.id}
          />
          <Chat.Input
            type={'channel'}
            name={channel.name}
            apiUrl={'/api/socket/messages'}
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom
          chatId={channel.id}
          video={false}
          audio={true}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom
          chatId={channel.id}
          video={true}
          audio={true}
        />
      )}
    </div>
  )
}

export default ChannelIdPage