import { NextResponse } from "next/server";

export async function GET() {
  // Test 1: Basic route matching
  let authModuleTest = "NOT TESTED";

  try {
    // Test 2: Can we import the auth module?
    const authModule = await import("@/auth");
    authModuleTest = `LOADED - exports: ${Object.keys(authModule).join(", ")}`;
  } catch (error: unknown) {
    const err = error as Error;
    authModuleTest = `FAILED - ${err.message}`;
  }

  return NextResponse.json({
    routeMatched: true,
    authModuleTest,
    mongoUri: process.env.MONGODB_URI ? "SET" : "NOT SET",
    authSecret: process.env.AUTH_SECRET ? "SET" : "NOT SET",
  });
}
