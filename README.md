# Next.js Website with Admin Dashboard

This is a Next.js website with a static home page, dynamic services and gallery pages, a contact form, and an admin dashboard for managing content.

## Features

- Static home page with hero section and features
- Dynamic services page pulling data from the database
- Dynamic gallery page with ordered images from the database
- Contact form that stores messages in the database
- Admin dashboard with authentication
- CRUD operations for services, gallery images, and messages
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-secure-password"
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Create the admin user:
```bash
npm run create-admin
```

## Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Admin Dashboard

Access the admin dashboard at `http://localhost:3000/admin` and log in with the credentials you set in the `.env` file.

## Database Schema

The application uses the following database schema:

- Users: Admin users for the dashboard
- Services: Company services with title, description, and optional price
- Gallery Images: Images with title, description, and order
- Contact Messages: Messages from the contact form

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- NextAuth.js

## License

MIT
