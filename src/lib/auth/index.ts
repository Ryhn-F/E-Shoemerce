// Server-side exports
export { auth } from "./config";
export * from "./actions";

export { AuthProvider, useAuth } from "./provider";

// Types
export type { User, Session, Account, Verification, Guest } from "../db/schema";
