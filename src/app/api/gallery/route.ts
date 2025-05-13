import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: {
        order: 'asc',
      },
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await request.json()
    const lastImage = await prisma.galleryImage.findFirst({
      orderBy: { order: 'desc' },
    })
    const order = lastImage ? lastImage.order + 1 : 0

    const image = await prisma.galleryImage.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        order,
      },
    })
    return NextResponse.json(image)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 