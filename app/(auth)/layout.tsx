import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-light-100 flex flex-col">
      {/* Header with Logo */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Link href="/" className="flex justify-center" aria-label="Nike Home">
            <Image
              src="/logo.svg"
              alt="Nike"
              width={80}
              height={29}
              priority
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <p className="text-dark-700 text-caption">
            © 2024 Nike, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
