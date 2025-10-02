"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "./client";
import { ensureGuestSession } from "./actions";

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  guestSession: any | null;
  hasAnySession: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  guestSession: null,
  hasAnySession: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const [guestSession, setGuestSession] = useState<any>(null);
  const [isLoadingGuest, setIsLoadingGuest] = useState(true);

  // Ensure guest session exists if no user session
  useEffect(() => {
    async function initGuestSession() {
      if (!session?.user && !isPending) {
        try {
          const guest = await ensureGuestSession();
          setGuestSession(guest);
        } catch (error) {
          console.error("Failed to create guest session:", error);
        }
      }
      setIsLoadingGuest(false);
    }

    initGuestSession();
  }, [session?.user, isPending]);

  // Clear guest session when user logs in
  useEffect(() => {
    if (session?.user && guestSession) {
      setGuestSession(null);
    }
  }, [session?.user, guestSession]);

  const value = {
    user: session?.user || null,
    isLoading: isPending || isLoadingGuest,
    guestSession,
    hasAnySession: !!(session?.user || guestSession),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
