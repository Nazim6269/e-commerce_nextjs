import { auth } from "@/auth";
import { findUserFromDB } from "@/lib/dbQuery";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 1. Get session via auth()
    const session = await auth();
    const email = session?.user?.email;

    // 2. Get raw JWT token
    let rawToken = null;
    let tokenError = null;
    try {
      rawToken = await getToken({
        req,
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
      });
    } catch (e: any) {
      tokenError = e.message;
    }

    // 3. Query DB for user
    let dbUser = null;
    let dbError = null;
    const queryEmail = email || rawToken?.email;

    if (queryEmail) {
      try {
        const user = await findUserFromDB(queryEmail as string);
        dbUser = user
          ? {
              _id: user._id?.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
            }
          : "NOT_FOUND";
      } catch (e: any) {
        dbError = e.message;
      }
    }

    // 4. List all auth-related cookies
    const cookies: Record<string, string> = {};
    req.cookies.getAll().forEach((c) => {
      if (
        c.name.includes("auth") ||
        c.name.includes("session") ||
        c.name.includes("next-auth") ||
        c.name.includes("csrf")
      ) {
        cookies[c.name] = c.value.substring(0, 30) + "...";
      }
    });

    return NextResponse.json({
      session: session
        ? {
            user: {
              name: session.user?.name,
              email: session.user?.email,
              role: (session.user as any)?.role,
              id: (session.user as any)?.id,
            },
          }
        : "NO_SESSION",
      rawToken: rawToken
        ? {
            email: rawToken.email,
            name: rawToken.name,
            role: rawToken.role,
            id: rawToken.id,
            sub: rawToken.sub,
            iat: rawToken.iat,
          }
        : "NO_TOKEN",
      tokenError,
      dbUser,
      dbError,
      cookies,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
