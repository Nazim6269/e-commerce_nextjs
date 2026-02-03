import { GET as AuthGET, POST as AuthPOST } from "@/auth";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string[] }> }) {
  return AuthGET(req, ctx);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ slug: string[] }> }) {
  return AuthPOST(req, ctx);
}
