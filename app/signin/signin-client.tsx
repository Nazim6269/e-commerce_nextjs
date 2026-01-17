"use client";

import { loginAction } from "@/actions/formAction";
import SocialLogin from "@/components/SocialLogin";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import type { SignInStateProps } from "./page";

// Zod validation schema
const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

type SignInFormData = z.infer<typeof signInSchema>;

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

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
    watch,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched", // Validate on blur
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const passwordValue = watch("password");

  // Handle success/error messages with toast
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message || "Welcome back! Logging you in...", {
          icon: "🎉",
        });
      } else {
        toast.error(state.message || "Oops! Unable to sign in. Please check your credentials.", {
          icon: "⚠️",
        });
      }
    }
  }, [state.message, state.success]);

  // Redirect on successful login
  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        router.push(callbackUrl);
      }, 1000);
    }
  }, [state.success, router, callbackUrl]);

  const onSubmit = (data: SignInFormData) => {
    const fd = new FormData();
    fd.append("email", data.email);
    fd.append("password", data.password);
    startTransition(() => {
      formAction(fd);
    });
  };

  const onError = () => {
    toast.error("Please complete all required fields correctly", {
      icon: "📋",
    });
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10b981",
              color: "#fff",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          },
        }}
      />

      <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
            Log in with your account
          </h2>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                className={`mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring transition-all ${errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-pink-500 focus:ring-pink-100"
                  }`}
                placeholder="you@example.com"
                disabled={isPending}
              />
              {errors.email && (
                <div className="mt-2 flex items-start gap-1.5">
                  <svg
                    className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                className={`mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring transition-all ${errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-pink-500 focus:ring-pink-100"
                  }`}
                placeholder="Enter a strong password"
                disabled={isPending}
              />
              {errors.password && (
                <div className="mt-2 flex items-start gap-1.5">
                  <svg
                    className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                </div>
              )}
              {!errors.password && touchedFields.password && passwordValue && passwordValue.length >= 6 && (
                <div className="mt-2 flex items-start gap-1.5">
                  <svg
                    className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-green-600">Password looks good!</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit(onSubmit, onError)}
              disabled={isPending}
              className="w-full rounded-lg bg-nazim py-2.5 font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 mt-6"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-nazim"
            >
              SignUp here
            </Link>
          </p>

          {/* Social Login */}
          <SocialLogin callbackUrl={callbackUrl} />
        </div>
      </section>
    </>
  );
}