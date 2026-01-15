"use client";

import { signUpAction } from "@/actions/formAction";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";

export type SignUpStateProps = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  success: boolean;
  message: string;
};

// Zod validation schema
const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

// form initial state
const initialFormState: SignUpStateProps = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  success: false,
  message: "",
};

const SignUpPage: React.FC<{}> = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialFormState
  );

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");

  // Handle success/error messages with toast
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(
          state.message || "Account created successfully! Redirecting...",
          {
            icon: "🎉",
          }
        );
      } else {
        toast.error(
          state.message || "Failed to create account. Please try again.",
          {
            icon: "⚠️",
          }
        );
      }
    }
  }, [state.message, state.success]);

  // Redirect on successful signup
  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    }
  }, [state.success, router]);

  const onSubmit = (data: SignUpFormData) => {
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("email", data.email);
    fd.append("password", data.password);
    fd.append("confirmPassword", data.confirmPassword);
    formAction(fd);
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
            Create an Account
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                {...register("name")}
                className={`mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring transition-all ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-pink-500 focus:ring-pink-100"
                }`}
                placeholder="Enter your name"
                disabled={isPending}
              />
              {errors.name && (
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
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                className={`mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring transition-all ${
                  errors.email
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
                className={`mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring transition-all ${
                  errors.password
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
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                </div>
              )}
              {!errors.password && touchedFields.password && passwordValue && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${
                        passwordValue.length >= 6
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p
                      className={`text-xs ${
                        passwordValue.length >= 6
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      At least 6 characters
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordValue)
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p
                      className={`text-xs ${
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordValue)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      Contains uppercase, lowercase & number
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                className={`mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring transition-all ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-pink-500 focus:ring-pink-100"
                }`}
                placeholder="Re-enter password"
                disabled={isPending}
              />
              {errors.confirmPassword && (
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
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                </div>
              )}
              {!errors.confirmPassword &&
                touchedFields.confirmPassword &&
                confirmPasswordValue &&
                passwordValue === confirmPasswordValue && (
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
                    <p className="text-sm text-green-600">Passwords match!</p>
                  </div>
                )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit(onSubmit, onError)}
              disabled={isPending}
              className="w-full rounded-lg bg-pink-600 py-2.5 font-semibold text-white transition-all hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60 mt-6"
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
                  Creating Account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-pink-600 hover:text-pink-700"
            >
              Login here
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default SignUpPage;