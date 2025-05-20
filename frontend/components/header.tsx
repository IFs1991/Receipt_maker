"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserCircle, LogOut, Menu } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const { user, signOut, isLoading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  // ユーザー名またはメールアドレスの最初の文字を取得
  const getUserInitials = () => {
    if (!user) return "？"
    if (user.user_metadata?.name) {
      return user.user_metadata.name.charAt(0)
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">メニュー</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/dashboard"
                  className="block px-2 py-1 hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  ダッシュボード
                </Link>
                <Link
                  href="/approval-info"
                  className="block px-2 py-1 hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  保険申請通過情報
                </Link>
                <Link
                  href="/return-info"
                  className="block px-2 py-1 hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  返戻情報
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-lg font-semibold md:text-xl">レセプト理由書アシスタント</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="hover:text-primary">
            ダッシュボード
          </Link>
          <Link href="/approval-info" className="hover:text-primary">
            保険申請通過情報
          </Link>
          <Link href="/return-info" className="hover:text-primary">
            返戻情報
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-default">
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>ログアウト</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/">
              <Button size="sm">ログイン</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}