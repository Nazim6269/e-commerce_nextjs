"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-red-50 dark:bg-red-950/30 p-8 rounded-full mb-8">
        <AlertTriangle size={80} className="text-red-500" />
      </div>

      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Something went wrong
      </h1>

      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 text-lg">
        An unexpected error occurred. Please try again or contact support if the
        problem persists.
      </p>

      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-nazim text-white px-8 py-3 rounded-full font-medium hover:bg-pink-600 transition-all shadow-lg active:scale-95"
        >
          Try Again
        </button>
        <a
          href="/"
          className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-full font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-md active:scale-95"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
