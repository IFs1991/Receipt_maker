"use client"

import type React from "react"

import { useState, useCallback, memo, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut, User, Menu } from "lucide-react"
import Link from "next/link"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"

// メモ化されたナビゲーションリンクコンポーネント
const NavLink = memo(function NavLink({
  href,
  children,
  isActive,
}: {
  href: string
  children: React.ReactNode
  isActive: boolean
}) {
  return (
    <Button variant={isActive ? "default" : "ghost"} asChild className="transition-all duration-150">
      <Link href={href}>{children}</Link>
    </Button>
  )
})

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  // ユーザー名をローカルストレージから取得（実際のアプリでは認証コンテキストから取得）
  const [userName, setUserName] = useLocalStorage("user-name", "山田 太郎")

  // モバイルメニューの状態
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // ナビゲーションリンクデータ
  const navLinks = [
    { href: "/dashboard", label: "ダッシュボード" },
    { href: "/return-info", label: "差し戻し情報" },
    { href: "/approval-info", label: "保険申請通過情報" },
  ]

  // ログアウト処理
  const handleLogout = useCallback(() => {
    // 実際のアプリでは、ここで認証状態をクリアします
    router.push("/")
  }, [router])

  // ESCキーでモバイルメニューを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // ページ遷移時にモバイルメニューを閉じる
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-16 border-b flex items-center justify-between px-4 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-[#4285f4]">レセプト理由書アシスタント</h1>
          <nav className="ml-8 hidden md:flex">
            <ul className="flex space-x-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href} isActive={pathname === link.href}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* モバイルメニューボタン */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="メニュー"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden md:flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 transition-all duration-150">
                <User className="h-4 w-4" />
                <span>{userName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="h-4 w-4 mr-2" />
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="bg-white w-64 h-full p-4 animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">{userName}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500">
                  <LogOut className="h-4 w-4 mr-2" />
                  ログアウト
                </Button>
              </div>
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  variant={pathname === link.href ? "default" : "ghost"}
                  className="justify-start"
                  asChild
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>
    </div>
  )
}
