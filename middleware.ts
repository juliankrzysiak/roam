import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
// import type { Database } from "@/lib/database.types";

// TODO: Notice any for initial testing
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<any>({ req, res });
  await supabase.auth.getSession();
  return res;
}
