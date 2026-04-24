import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // 1. 创建 Supabase 服务器客户端
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 2. 获取当前用户
  const { data: { user } } = await supabase.auth.getUser()

  const is_admin_path = request.nextUrl.pathname.startsWith('/admin')
  const is_login_path = request.nextUrl.pathname === '/login'

  // 3. 【核心拦截逻辑】
  // 如果是后台路径且没登录 -> 踢到登录页
  if (is_admin_path && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 如果已经登录还想去登录页 -> 踢到后台
  if (is_login_path && user) {
    return NextResponse.redirect(new URL('/admin/products', request.url))
  }

  return response
}

// 确保拦截所有后台路径
export const config = {
  matcher: ['/admin/:path*', '/login'],
}