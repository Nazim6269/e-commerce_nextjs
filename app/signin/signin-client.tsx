"use client";

import { loginAction } from "@/actions/formAction";
import SocialLogin from "@/components/SocialLogin";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState } from "react";
import type { SignInStateProps } from "./page";

// form initial state
const initialFormState: SignInStateProps = {
  email: "",
  password: "",
  success: false,
  message: "",
};

export default function SignInClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialFormState
  );

  if (state.success) {
    router.push(callbackUrl);
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Log in with your account
        </h2>

        <form action={formAction} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring focus:outline-none focus:ring-pink-100"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring focus:outline-none focus:ring-pink-100"
              placeholder="Enter a strong password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-pink-600 py-2 font-semibold text-white transition-all hover:bg-pink-700 disabled:opacity-60"
          >
            {isPending ? "Signing in ..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-pink-600 hover:text-pink-700"
          >
            SignUp here
          </Link>
        </p>

        {/* Social Login */}
        <SocialLogin callbackUrl={callbackUrl} />
      </div>
    </section>
  );
}

