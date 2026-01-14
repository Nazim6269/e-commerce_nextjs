"use client";

import { signIn } from "next-auth/react";

const loading = false;

const SocialLogin = ({ callbackUrl }: { callbackUrl?: string }) => {
  const handleClick = async (providers: string) => {
    await signIn(providers, {
      callbackUrl: callbackUrl || "/",
    });
  };
  return (
    <>
      <button
        type="button"
        onClick={() => handleClick("google")}
        disabled={loading}
        className="w-full rounded-lg border border-1 mt-2  py-2 font-semibold text-gray-500 transition-all disabled:opacity-60"
      >
        {loading ? "Creating Account..." : "Login with Google"}
      </button>
      <button
        type="button"
        onClick={() => handleClick("github")}
        disabled={loading}
        className="w-full rounded-lg border border-1 mt-2  py-2 font-semibold text-gray-500 transition-all disabled:opacity-60"
      >
        {loading ? "Creating Account..." : "Login with Github"}
      </button>
    </>
  );
};

export default SocialLogin;
