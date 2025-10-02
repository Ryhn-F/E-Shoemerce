# JWT Authentication System

## Overview

This project implements a robust JWT-based authentication system that works reliably in production environments. The system uses access tokens with 1-year expiration and refresh tokens stored in secure httpOnly cookies.

## Architecture

### Components

1. **Database Layer** (`src/lib/db/connection.ts`)

   - Lazy-loaded Neon PostgreSQL connection
   - Better Auth compatible schema
   - Error handling for environment variables

2. **Token Management** (`src/lib/auth/tokens.ts`)

   - JWT access token creation and verification
   - Token manager for client-side storage
   - Automatic token refresh functionality

3. **API Endpoints**

   - `/api/auth/signup-simple` - User registration
   - `/api/auth/signin-simple` - User authentication
   - `/api/auth/signout` - Session termination
   - `/api/auth/refresh` - Token refresh
   - `/api/auth/me` - Current user info

4. **Client Library** (`src/lib/auth/client.ts`)

   - React hooks for authentication state
   - Automatic token management
   - Fallback session detection

5. **Server Utilities** (`src/lib/auth/utils.ts`)

   - Server-side session detection
   - JWT token verification
   - User authentication helpers

6. **Middleware** (`middleware.ts`)
   - Automatic token refresh
   - Route protection
   - Authentication redirects

## Features

### Security

- JWT tokens signed with HMAC SHA-256
- Secure httpOnly cookies for refresh tokens
- Automatic token refresh before expiration
- Password hashing with bcrypt (12 rounds)
- CSRF protection via SameSite cookies

### Production Ready

- Environment variable validation
- Comprehensive error handling
- Lazy database connections
- Cross-domain cookie support
- Vercel deployment compatibility

### User Experience

- 1-year token expiration (minimal re-authentication)
- Automatic session restoration
- Seamless token refresh
- Multiple session detection methods

## Environment Variables

```bash
# Required
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"
BETTER_AUTH_SECRET="your-secret-key-minimum-32-characters"

# Development
BETTER_AUTH_URL="http://localhost:3000/api/auth"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000/api/auth"

# Production
BETTER_AUTH_URL="https://yourdomain.com/api/auth"
NEXT_PUBLIC_BETTER_AUTH_URL="https://yourdomain.com/api/auth"
```

## Usage

### Client-Side Authentication

```typescript
import { signIn, signUp, signOut, useSession } from "@/src/lib/auth/client";

// Sign up
const result = await signUp.email({
  email: "user@example.com",
  password: "password123",
  name: "User Name",
});

// Sign in
const result = await signIn.email({
  email: "user@example.com",
  password: "password123",
});

// Sign out
await signOut();

// Check session
const session = useSession();
if (session.data) {
  console.log("User:", session.data.user);
}
```

### Server-Side Authentication

```typescript
import { getCurrentUser } from "@/src/lib/auth/utils";

// In API routes or server components
const user = await getCurrentUser();
if (user) {
  console.log("Authenticated user:", user);
}
```

## Database Schema

The system uses Better Auth compatible tables:

- `user` - User accounts
- `session` - User sessions (for Better Auth compatibility)
- `account` - OAuth accounts (future use)
- `verification` - Email verification tokens

## Token Flow

1. **Authentication**: User signs in with email/password
2. **Token Creation**: Server creates JWT access token + refresh token
3. **Storage**: Access token in memory/localStorage, refresh token in httpOnly cookie
4. **Requests**: Access token sent with API requests
5. **Refresh**: Automatic refresh when token expires
6. **Logout**: Clear all tokens and cookies

## Testing

Visit `/test-auth` to test the authentication system in the browser.

## Production Deployment

1. Set environment variables in your deployment platform
2. Ensure `BETTER_AUTH_SECRET` is at least 32 characters
3. Set correct `BETTER_AUTH_URL` for your domain
4. Database tables will be created automatically

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**

   - Ensure `.env` file is in project root
   - Check variable names match exactly
   - Restart development server

2. **Database Connection Errors**

   - Verify `DATABASE_URL` format
   - Check network connectivity to database
   - Ensure SSL mode is correct

3. **Token Verification Failures**
   - Verify `BETTER_AUTH_SECRET` is consistent
   - Check token expiration
   - Ensure proper JWT format

### Debug Mode

Add console logs to see authentication flow:

```typescript
// In token manager
console.log(
  "Token status:",
  tokenManager.getAccessToken() ? "Valid" : "Invalid"
);

// In API routes
console.log("Auth headers:", request.headers.get("authorization"));
```

## Migration from Better Auth

This system maintains compatibility with Better Auth while adding production-ready JWT tokens. The original Better Auth endpoints (`/api/auth/[...all]`) remain available for OAuth and other features.

## Security Considerations

- Tokens expire in 1 year (adjust as needed)
- Refresh tokens should be rotated (future enhancement)
- Consider implementing rate limiting
- Monitor for suspicious authentication patterns
- Regular security audits recommended
