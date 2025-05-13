import { PrismaClient } from '../src/generated/prisma'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Please provide email and password')
    process.exit(1)
  }

  try {
    const hashedPassword = await hash(password, 12)
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'admin',
      },
      create: {
        email,
        password: hashedPassword,
        role: 'admin',
        name: 'Admin User',
      },
    })

    console.log('Admin user created/updated:', user.email)
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 