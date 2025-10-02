# Authentication System

This authentication system is built with Better Auth, Drizzle ORM, and PostgreSQL, designed for a Nike-style e-commerce application.

## Features

- **Email/Password Authentication**: Secure login and registration
- **Guest Sessions**: Allow users to browse and add items to cart without signing up
- **Session Management**: Cookie-based sessions with 7-day expiry
- **Guest-to-User Migration**: Seamless cart transfer when guests sign up/in
- **Route Protection**: Middleware-based protection for checkout and user pages
- **Type Safety**: Full TypeScript support with Zod validation

## Database Schema

### Core Tables

- `user`: User accounts with email, name, and verification status
- `session`: User sessions with tokens and metadata
- `account`: Account providers (credentials, OAuth ready)
- `verification`: Email verification tokens (ready for future use)
- `guest`: Guest sessions for anonymous users

## Usage

### Server Actions

```typescript
import {
  signUp,
  signIn,
  signOut,
  createGuestSession,
} from "@/src/lib/auth/actions";

// Sign up new user
const result = await signUp(formData);

// Sign in existing user
const result = await signIn(formData);

// Sign out current user
await signOut();

// Create guest session
await createGuestSession();
```

### Client Hooks

```typescript
import { useAuth } from "@/src/lib/auth";

function MyComponent() {
  const { user, isLoading, guestSession, hasAnySession } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <p>Welcome, {user.name}!</p>
      ) : guestSession ? (
        <p>Browsing as guest</p>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
}
```

### Server Utilities

```typescript
import {
  getCurrentUser,
  requireAuth,
  ensureGuestSession,
} from "@/src/lib/auth/utils";

// Get current user (returns null if not authenticated)
const user = await getCurrentUser();

// Require authentication (throws if not authenticated)
const user = await requireAuth();

// Ensure guest session exists
const guestSession = await ensureGuestSession();
```

## Route Protection

The middleware automatically handles:

- Redirecting unauthenticated users from `/checkout`, `/profile`, `/orders`
- Redirecting authenticated users away from `/sign-in`, `/sign-up`
- Preserving callback URLs for post-auth redirects

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

## Setup Instructions

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:

   ```bash
   cp .env.example .env
   # Fill in your database URL and auth secret
   ```

3. **Generate and run migrations**:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Wrap your app with AuthProvider**:

   ```typescript
   import { AuthProvider } from "@/src/lib/auth";

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <AuthProvider>{children}</AuthProvider>
         </body>
       </html>
     );
   }
   ```

## Security Features

- **HttpOnly Cookies**: Prevent XSS attacks
- **Secure Cookies**: HTTPS-only in production
- **SameSite Strict**: CSRF protection
- **Input Validation**: Zod schemas for all inputs
- **Password Hashing**: Handled by Better Auth
- **Session Expiry**: Automatic cleanup of expired sessions

## Future Enhancements

- Email verification
- OAuth providers (Google, GitHub, etc.)
- Two-factor authentication
- Role-based access control
- Password reset functionality

## Cart Integration

When implementing cart functionality, use the `mergeGuestCartWithUserCart` function in `actions.ts` to handle guest-to-user cart migration. This function is called automatically during sign-in/sign-up.
