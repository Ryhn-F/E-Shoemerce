"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthForm from "@/src/components/AuthForm";
import SocialProviders from "@/src/components/SocialProviders";
import { signIn } from "@/src/lib/auth/client";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleFormSubmit = async (data: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setError(result.error.message || "Failed to sign in");
      } else {
        router.push(callbackUrl);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign in clicked");
    // TODO: Implement Google authentication
  };

  const handleAppleSignIn = () => {
    console.log("Apple sign in clicked");
    // TODO: Implement Apple authentication
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-heading-3 text-dark-900 mb-2">Welcome back</h1>
        <p className="text-body text-dark-700">Sign in to your Nike account</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Social Sign In */}
      <div>
        <SocialProviders
          onGoogleClick={handleGoogleSignIn}
          onAppleClick={handleAppleSignIn}
        />
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-light-400" />
        </div>
        <div className="relative flex justify-center text-caption">
          <span className="bg-light-100 px-4 text-dark-500">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Email/Password Formm */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-900"></div>
          </div>
        )}
        <AuthForm type="signin" onSubmit={handleFormSubmit} />
      </div>

      {/* Forgot Password */}
      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-body text-dark-700 hover:text-dark-900 transition-colors"
        >
          Forgot your password?
        </Link>
      </div>

      {/* Sign Up Link */}
      <div className="text-center pt-6 border-t border-light-300">
        <p className="text-body text-dark-700">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-dark-900 font-medium hover:underline transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
