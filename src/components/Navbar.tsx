"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { NavbarProps } from "./types";
import { useAuth } from "@/src/lib/auth";
import { signOut } from "@/src/lib/auth/client";

export default function Navbar({
  cartItemCount = 0,
  onSearchClick,
  onCartClick,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationItems = [
    { label: "New", href: "/products" },
    { label: "Men", href: "/products?gender=men" },
    { label: "Women", href: "/products?gender=women" },
    { label: "Kids", href: "/products?gender=kids" },
    { label: "Collections", href: "/collections" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className="bg-light-100 border-b border-light-300 sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center" aria-label="Nike Home">
              <Image
                src="/logo.svg"
                alt="Nike"
                width={60}
                height={22}
                priority
                className="h-6 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex space-x-8" role="menubar">
              {navigationItems.map((item) => (
                <li key={item.label} role="none">
                  <a
                    href={item.href}
                    className="text-dark-900 hover:text-dark-700 px-3 py-2 text-body font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-dark-900 after:transition-all after:duration-200 hover:after:w-full"
                    role="menuitem"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              type="button"
              onClick={onSearchClick}
              className="text-dark-900 hover:text-dark-700 p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded-md"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={onCartClick}
              className="text-dark-900 hover:text-dark-700 p-2 relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded-md"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red text-light-100 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </button>

            {/* Auth Section */}
            {isLoading ? (
              <div className="w-8 h-8 animate-pulse bg-light-300 rounded-full"></div>
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-dark-900 hover:text-dark-700 p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded-md"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-dark-900 text-light-100 rounded-full flex items-center justify-center text-sm font-medium">
                    {user.name
                      ? user.name.charAt(0).toUpperCase()
                      : user.email.charAt(0).toUpperCase()}
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-light-300">
                    <div className="px-4 py-2 text-sm text-dark-700 border-b border-light-300">
                      <p className="font-medium">{user.name || "User"}</p>
                      <p className="text-dark-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-dark-900 hover:bg-light-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-dark-900 hover:bg-light-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-dark-900 hover:bg-light-100 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/sign-in"
                  className="text-dark-900 hover:text-dark-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-dark-900 text-light-100 hover:bg-dark-700 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="text-dark-900 hover:text-dark-700 p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded-md"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen ? "true" : "false"}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-light-300 py-4">
            <ul className="space-y-2" role="menu">
              {navigationItems.map((item) => (
                <li key={item.label} role="none">
                  <a
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-dark-900 hover:text-dark-700 hover:bg-light-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded-md"
                    role="menuitem"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile Actions */}
            <div className="mt-4 pt-4 border-t border-light-300 space-y-2">
              <button
                type="button"
                onClick={() => {
                  onSearchClick?.();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-dark-900 hover:text-dark-700 hover:bg-light-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded-md"
                aria-label="Search"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </button>

              <button
                type="button"
                onClick={() => {
                  onCartClick?.();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-dark-900 hover:text-dark-700 hover:bg-light-200 transition-colors duration-200 relative focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded-md"
                aria-label={`Shopping cart with ${cartItemCount} items`}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
                My Cart ({cartItemCount})
              </button>

              {/* Mobile Auth Section */}
              <div className="pt-2 border-t border-light-300">
                {isLoading ? (
                  <div className="px-3 py-2">
                    <div className="w-full h-8 animate-pulse bg-light-300 rounded"></div>
                  </div>
                ) : user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-dark-700">
                      <p className="font-medium">{user.name || "User"}</p>
                      <p className="text-dark-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-base font-medium text-dark-900 hover:text-dark-700 hover:bg-light-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-3 py-2 text-base font-medium text-dark-900 hover:text-dark-700 hover:bg-light-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-dark-900 hover:text-dark-700 hover:bg-light-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded-md"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/sign-in"
                      className="block px-3 py-2 text-base font-medium text-dark-900 hover:text-dark-700 hover:bg-light-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      className="block px-3 py-2 text-base font-medium bg-dark-900 text-light-100 hover:bg-dark-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Join Us
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
