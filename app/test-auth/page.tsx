"use client";

import { useState } from "react";
import { signIn, signUp, signOut, useSession } from "@/src/lib/auth/client";

export default function TestAuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const session = useSession();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await signUp.email({ email, password, name });
      if (result.error) {
        setMessage(`Sign up failed: ${result.error.message}`);
      } else {
        setMessage("Sign up successful!");
        setEmail("");
        setPassword("");
        setName("");
      }
    } catch (error) {
      setMessage("Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await signIn.email({ email, password });
      if (result.error) {
        setMessage(`Sign in failed: ${result.error.message}`);
      } else {
        setMessage("Sign in successful!");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      setMessage("Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setMessage("");

    try {
      const result = await signOut();
      if (result.error) {
        setMessage(`Sign out failed: ${result.error.message}`);
      } else {
        setMessage("Sign out successful!");
      }
    } catch (error) {
      setMessage("Sign out failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Test Authentication
        </h1>

        {/* Session Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">Session Status:</h2>
          {session.data ? (
            <div>
              <p className="text-green-600">✓ Authenticated</p>
              <p>User: {session.data.user.name}</p>
              <p>Email: {session.data.user.email}</p>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          ) : (
            <p className="text-red-600">✗ Not authenticated</p>
          )}
        </div>

        {/* Auth Forms */}
        {!session.data && (
          <div className="space-y-6">
            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              <h2 className="text-lg font-semibold">Sign Up</h2>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            <hr />

            {/* Sign In Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <h2 className="text-lg font-semibold">Sign In</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
