import { NextResponse } from "next/server";

export function middleware() {
  // 把鉴权工作全权交给前端 Refine (authProvider) 处理
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};