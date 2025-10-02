import { auth } from "./config";
import { getGuestSession, createGuestSession } from "./actions";

// Server-side session utilities
export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(),
    });
    return session?.user || null;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

// Get or create guest session
export async function ensureGuestSession() {
  let guestSession = await getGuestSession();

  if (!guestSession) {
    const result = await createGuestSession();
    if (result.success) {
      guestSession = await getGuestSession();
    }
  }

  return guestSession;
}

// Check if user has any session (auth or guest)
export async function hasAnySession() {
  const user = await getCurrentUser();
  if (user) return { type: "user", data: user };

  const guestSession = await getGuestSession();
  if (guestSession) return { type: "guest", data: guestSession };

  return null;
}

// Session type guards
interface UserSession {
  type: "user";
  data: {
    id: string;
    email: string;
    name: string;
  };
}

interface GuestSession {
  type: "guest";
  data: {
    id: string;
    sessionToken: string;
  };
}

type SessionData = UserSession | GuestSession | null;

export function isUserSession(session: SessionData): session is UserSession {
  return session?.type === "user";
}

export function isGuestSession(session: SessionData): session is GuestSession {
  return session?.type === "guest";
}
