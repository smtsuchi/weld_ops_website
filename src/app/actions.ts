'use server'

import { prisma } from '@/lib/prisma'

// Gallery actions
export async function getGalleryImages() {
  const images = await prisma.galleryImage.findMany({
    orderBy: {
      order: 'asc',
    },
  })
  return images
}

// Services actions
export async function getServices() {
  const services = await prisma.service.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
  return services
}

// Admin dashboard actions
export async function getStats() {
  const [servicesCount, galleryCount, messagesCount, unreadMessagesCount] =
    await Promise.all([
      prisma.service.count(),
      prisma.galleryImage.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({
        where: {
          read: false,
        },
      }),
    ])

  return {
    servicesCount,
    galleryCount,
    messagesCount,
    unreadMessagesCount,
  }
}

// Admin services actions
export async function createService(data: {
  title: string
  description: string
  price?: number
  imageUrl?: string
}) {
  const service = await prisma.service.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price ? parseFloat(data.price.toString()) : null,
      imageUrl: data.imageUrl || null,
    },
  })
  return service
}

export async function updateService(data: {
  id: string
  title: string
  description: string
  price?: number
  imageUrl?: string
}) {
  const service = await prisma.service.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.description,
      price: data.price ? parseFloat(data.price.toString()) : null,
      imageUrl: data.imageUrl || null,
    },
  })
  return service
}

export async function deleteService(id: string) {
  await prisma.service.delete({
    where: { id },
  })
}

// Admin gallery actions
export async function createGalleryImage(data: {
  title: string
  description?: string
  imageUrl: string
  order: number
}) {
  const image = await prisma.galleryImage.create({
    data,
  })
  return image
}

export async function updateGalleryImage(data: {
  id: string
  title: string
  description?: string
  imageUrl: string
  order: number
}) {
  const image = await prisma.galleryImage.update({
    where: { id: data.id },
    data,
  })
  return image
}

export async function deleteGalleryImage(id: string) {
  await prisma.galleryImage.delete({
    where: { id },
  })
}

export async function reorderGalleryImages(images: { id: string; order: number }[]) {
  await Promise.all(
    images.map((image) =>
      prisma.galleryImage.update({
        where: { id: image.id },
        data: { order: image.order },
      })
    )
  )
}

// Admin messages actions
export async function getMessages() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
  return messages
}

export async function markMessageAsRead(id: string) {
  const message = await prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  })
  return message
}

export async function deleteMessage(id: string) {
  await prisma.contactMessage.delete({
    where: { id },
  })
} 