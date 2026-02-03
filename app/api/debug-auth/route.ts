import { auth } from "@/auth";
import { findUserFromDB } from "@/lib/dbQuery";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    const email = session?.user?.email;

    let dbUser = null;
    let dbError = null;

    if (email) {
      try {
        const user = await findUserFromDB(email);
        dbUser = user
          ? {
              _id: user._id?.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
              hasRole: "role" in user,
            }
          : "NOT_FOUND";
      } catch (e: any) {
        dbError = e.message;
      }
    }

    return NextResponse.json({
      session: session
        ? {
            user: {
              name: session.user?.name,
              email: session.user?.email,
              image: session.user?.image,
              role: (session.user as any)?.role,
              id: (session.user as any)?.id,
            },
          }
        : null,
      dbUser,
      dbError,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
