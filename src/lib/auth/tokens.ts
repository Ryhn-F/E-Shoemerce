import jwt from "jsonwebtoken";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

// Client-side token management
export class TokenManager {
  private static instance: TokenManager;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number | null = null;

  private constructor() {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      this.loadFromStorage();
    }
  }

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem("auth-tokens");
      if (stored) {
        const { accessToken, refreshToken, expiresAt } = JSON.parse(stored);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
      }
    } catch (error) {
      console.error("Failed to load tokens from storage:", error);
      this.clearTokens();
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;

    try {
      if (this.accessToken && this.refreshToken && this.expiresAt) {
        localStorage.setItem(
          "auth-tokens",
          JSON.stringify({
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            expiresAt: this.expiresAt,
          })
        );
      } else {
        localStorage.removeItem("auth-tokens");
      }
    } catch (error) {
      console.error("Failed to save tokens to storage:", error);
    }
  }

  setTokens(tokenPair: TokenPair) {
    this.accessToken = tokenPair.accessToken;
    this.refreshToken = tokenPair.refreshToken;
    this.expiresAt = Date.now() + tokenPair.expiresIn * 1000;
    this.saveToStorage();
  }

  getAccessToken(): string | null {
    if (!this.accessToken || !this.expiresAt) {
      return null;
    }

    // Check if token is expired (with 5 minute buffer)
    if (Date.now() > this.expiresAt - 5 * 60 * 1000) {
      return null;
    }

    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  isTokenExpired(): boolean {
    if (!this.expiresAt) return true;
    return Date.now() > this.expiresAt - 5 * 60 * 1000;
  }

  async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) {
      return null;
    }

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();

      this.setTokens({
        accessToken: data.accessToken,
        refreshToken: this.refreshToken, // Keep existing refresh token
        expiresIn: data.expiresIn,
        user: data.user,
      });

      return data.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearTokens();
      return null;
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-tokens");
    }
  }

  async getValidAccessToken(): Promise<string | null> {
    const currentToken = this.getAccessToken();

    if (currentToken) {
      return currentToken;
    }

    // Try to refresh if we have a refresh token
    if (this.refreshToken) {
      return await this.refreshAccessToken();
    }

    return null;
  }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();

// Server-side token verification
export async function verifyAccessToken(
  token: string
): Promise<JWTPayload | null> {
  try {
    const secret = process.env.BETTER_AUTH_SECRET!;
    const payload = jwt.verify(token, secret) as JWTPayload;
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

// Create JWT access token
export function createAccessToken(user: {
  id: string;
  email: string;
  name: string;
}): string {
  const secret = process.env.BETTER_AUTH_SECRET!;
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
  };

  return jwt.sign(payload, secret, {
    expiresIn: "365d", // 1 year
  });
}

// Create refresh token (simple random string)
export function createRefreshToken(): string {
  return crypto.randomUUID() + "-" + Date.now();
}

// Create tokens after successful authentication
export function createTokenPair(user: {
  id: string;
  email: string;
  name: string;
}): TokenPair {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken();

  return {
    accessToken,
    refreshToken,
    expiresIn: 60 * 60 * 24 * 365, // 1 year in seconds
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}
