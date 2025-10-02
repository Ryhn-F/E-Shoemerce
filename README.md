# E-Commerce App

A modern e-commerce application built with Next.js, featuring Nike products with authentication, database integration, and state management.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### 1. Environment Setup

Copy the environment variables template:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Neon PostgreSQL connection string and auth secrets:

```env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
```

### 2. Database Setup

Generate and push the database schema:

```bash
npm run db:push
```

Seed the database with Nike products:

```bash
curl -X POST http://localhost:3000/api/seed
```

### 3. Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
