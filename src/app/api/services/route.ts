import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
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
    const service = await prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price ? parseFloat(data.price) : null,
        imageUrl: data.imageUrl || null,
      },
    })
    return NextResponse.json(service)
  } catch (error) {
    console.error('Error creating service:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await request.json()
    const service = await prisma.service.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price ? parseFloat(data.price) : null,
        imageUrl: data.imageUrl || null,
      },
    })
    return NextResponse.json(service)
  } catch (error) {
    console.error('Error updating service:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return new NextResponse('Service ID is required', { status: 400 })
    }

    await prisma.service.delete({
      where: { id },
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting service:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 