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

    const { newOrder } = await request.json()
    const image = await prisma.galleryImage.findUnique({
      where: { id: params.id },
    })

    if (!image) {
      return new NextResponse('Image not found', { status: 404 })
    }

    // Update the order of the moved image
    await prisma.galleryImage.update({
      where: { id: params.id },
      data: { order: newOrder },
    })

    // Update the order of other images
    if (newOrder > image.order) {
      // Moving down: decrease order of images in between
      await prisma.galleryImage.updateMany({
        where: {
          order: {
            gt: image.order,
            lte: newOrder,
          },
          id: { not: params.id },
        },
        data: {
          order: { decrement: 1 },
        },
      })
    } else {
      // Moving up: increase order of images in between
      await prisma.galleryImage.updateMany({
        where: {
          order: {
            gte: newOrder,
            lt: image.order,
          },
          id: { not: params.id },
        },
        data: {
          order: { increment: 1 },
        },
      })
    }

    const updatedImage = await prisma.galleryImage.findUnique({
      where: { id: params.id },
    })
    return NextResponse.json(updatedImage)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 