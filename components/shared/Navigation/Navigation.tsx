import React from 'react'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import ThemeSwitcher from '@/components/shared/ThemeSwitcher'
import NavigationAction from './Navigation.Action'
import NavigationItem from './Navigation.Item'

const Navigation = async () => {

  const profile = await currentProfile()

  if (!profile) return redirect('/')

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        }
      }
    }
  })

  return (
    <div className={'h-full w-full py-3 space-y-4 flex flex-col items-center text-primary bg-[#e3e5ea] dark:bg-[#1e1f22]'}>
      <NavigationAction />
      <Separator className={'h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto'} />
      <ScrollArea className={'flex-1 w-full'}>
        {
          servers.map(server => (
            <div
              key={server.id}
              className={'mb-4'}
            >
              <NavigationItem
                id={server.id}
                name={server.name}
                imageUrl={server.imageUrl}
              />
            </div>
          ))
        }
      </ScrollArea>
      <div className={'pb-3 mt-auto flex items-center flex-col gap-y-4'}>
        <ThemeSwitcher />
        <UserButton
          afterSignOutUrl={'/'}
          appearance={{
            elements: {
              avatarBox: 'h-12 w-12'
            }
          }}
        />
      </div>
    </div>
  )
}

export default Navigation