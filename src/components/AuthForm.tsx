"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
  type: "signin" | "signup";
  onSubmit: (data: {
    email: string;
    password: string;
    confirmPassword?: string;
  }) => void;
}

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-body-medium text-dark-900 mb-2"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-light-400 rounded-lg text-body text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent transition-colors"
          placeholder="Enter your email"
        />
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="block text-body-medium text-dark-900 mb-2"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={
              type === "signin" ? "current-password" : "new-password"
            }
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 pr-12 border border-light-400 rounded-lg text-body text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent transition-colors"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-900 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password Field (Sign Up only) */}
      {type === "signup" && (
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-body-medium text-dark-900 mb-2"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 border border-light-400 rounded-lg text-body text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent transition-colors"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-900 transition-colors"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-dark-900 text-light-100 py-3 px-4 rounded-lg text-body-medium font-medium hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 transition-colors"
      >
        {type === "signin" ? "Sign In" : "Create Account"}
      </button>
    </form>
  );
}
