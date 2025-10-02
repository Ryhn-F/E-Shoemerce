"use client";

import { testAuthSession } from "@/src/lib/actions/test-auth";

export default function AuthTestButton() {
  const handleTest = async () => {
    console.log("Testing auth session...");
    const result = await testAuthSession();
    console.log("Auth test result:", result);
  };

  return (
    <button
      onClick={handleTest}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Test Auth Session
    </button>
  );
}
