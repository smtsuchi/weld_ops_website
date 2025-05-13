'use server'

import { prisma } from '@/lib/prisma'

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