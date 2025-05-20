import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// 認証が必要なルート
const protectedRoutes = [
  '/dashboard',
  '/approval-info',
  '/return-info',
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // クッキーを設定
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          return req.cookies.get(name)?.value
        },
        set: (name, value, options) => {
          req.cookies.set({
            name,
            value,
            ...options
          })
          res.cookies.set({
            name,
            value,
            ...options
          })
        },
        remove: (name, options) => {
          req.cookies.delete({
            name,
            ...options
          })
          res.cookies.delete({
            name,
            ...options
          })
        }
      }
    }
  )

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  // 保護されたルートにアクセスしようとしていて、かつログインしていない場合
  if (protectedRoutes.some(route => path.startsWith(route)) && !session) {
    const redirectUrl = new URL('/', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // ログイン済みでルートページにアクセスした場合はダッシュボードへリダイレクト
  if (path === '/' && session) {
    const redirectUrl = new URL('/dashboard', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// middlewareを適用するパスを指定
export const config = {
  matcher: ['/', '/dashboard/:path*', '/approval-info/:path*', '/return-info/:path*'],
}