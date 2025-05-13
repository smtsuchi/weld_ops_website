'use server'

import { prisma } from '@/lib/prisma'
import { put, del } from '@vercel/blob'

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
export async function createService(formData: FormData) {  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const imageFile = formData.get('image') as File

  if (!title || !description || !price || !imageFile) {
    throw new Error('Missing required fields')
  }

  const imageUrl = await uploadImage(imageFile)

  return prisma.service.create({
    data: {
      title,
      description,
      price,
      imageUrl,
    },
  })
}

export async function updateService(id: string, formData: FormData) {  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const imageFile = formData.get('image') as File | null

  if (!title || !description || !price) {
    throw new Error('Missing required fields')
  }

  const data: any = {
    title,
    description,
    price,
  }

  if (imageFile) {
    data.imageUrl = await uploadImage(imageFile)
  }

  return prisma.service.update({
    where: { id },
    data,
  })
}

async function deleteBlobImage(url: string) {  
  if (!url) return;
  
  try {
    // Extract the blob ID from the URL
    const blobId = url.split('/').pop();
    if (blobId) {
      await del(blobId);
    }
  } catch (error) {
    console.error('Error deleting blob image:', error);
  }
}

export async function deleteService(id: string) {  
  // Get the service to get the image URL
  const service = await prisma.service.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  // Delete the service
  await prisma.service.delete({
    where: { id },
  });

  // Delete the image from blob storage if it exists
  if (service?.imageUrl) {
    await deleteBlobImage(service.imageUrl);
  }
}

// Admin gallery actions
export async function createGalleryImage(formData: FormData) {  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File

  if (!title || !description || !imageFile) {
    throw new Error('Missing required fields')
  }

  const imageUrl = await uploadImage(imageFile)

  // Get the highest order number
  const highestOrder = await prisma.galleryImage.findFirst({
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  const newOrder = (highestOrder?.order ?? 0) + 1

  return prisma.galleryImage.create({
    data: {
      title,
      description,
      imageUrl,
      order: newOrder,
    },
  })
}

export async function updateGalleryImage(id: string, formData: FormData) {  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File | null

  if (!title || !description) {
    throw new Error('Missing required fields')
  }

  const data: any = {
    title,
    description,
  }

  if (imageFile) {
    data.imageUrl = await uploadImage(imageFile)
  }

  return prisma.galleryImage.update({
    where: { id },
    data,
  })
}

export async function deleteGalleryImage(id: string) {  
  // Get the image to get the image URL
  const image = await prisma.galleryImage.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  // Delete the gallery image
  await prisma.galleryImage.delete({
    where: { id },
  });

  // Delete the image from blob storage if it exists
  if (image?.imageUrl) {
    await deleteBlobImage(image.imageUrl);
  }
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

export async function uploadImage(file: File): Promise<string> {
  'use server'
  
  if (!file) {
    throw new Error('No file provided')
  }

  const blob = await put(file.name, file, {
    access: 'public',
  })

  return blob.url
}

// Message actions
export async function markMessagesAsRead(ids: string[]) {
  'use server';
  
  return prisma.contactMessage.updateMany({
    where: {
      id: { in: ids },
    },
    data: {
      read: true,
    },
  });
}

export async function deleteMessages(ids: string[]) {
  'use server';
  
  return prisma.contactMessage.deleteMany({
    where: {
      id: { in: ids },
    },
  });
} 
