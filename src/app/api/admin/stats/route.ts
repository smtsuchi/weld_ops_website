import { NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions)
//     if (!session) {
//       return new NextResponse('Unauthorized', { status: 401 })
//     }

//     const [servicesCount, galleryCount, messagesCount, unreadMessagesCount] =
//       await Promise.all([
//         prisma.service.count(),
//         prisma.galleryImage.count(),
//         prisma.contactMessage.count(),
//         prisma.contactMessage.count({
//           where: {
//             read: false,
//           },
//         }),
//       ])

//     return NextResponse.json({
//       servicesCount,
//       galleryCount,
//       messagesCount,
//       unreadMessagesCount,
//     })
//   } catch (error) {
//     console.error('Error fetching admin stats:', error)
//     return new NextResponse('Internal Server Error', { status: 500 })
//   }
// } 

export async function GET() {
  return NextResponse.json({ message: 'Hello, world!' })
} 