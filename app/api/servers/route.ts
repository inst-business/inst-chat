import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'

const POST = async (req: Request) => {
  try {
    const profile = await currentProfile()

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })
    
    const { name, imageUrl } = await req.json()

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [
            { name: 'general', profileId: profile.id }
          ]
        },
        members: {
          create: [
            { profileId: profile.id, role: MemberRole.ADMIN }
          ]
        }
      }
    })

    return NextResponse.json(server)
  }
  catch (err) {
    console.error('[SERVERS_POST]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export {
  POST,
}