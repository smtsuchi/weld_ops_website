import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const message = await prisma.contactMessage.update({
      where: { id: params.id },
      data: { read: true },
    })
    return NextResponse.json(message)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 