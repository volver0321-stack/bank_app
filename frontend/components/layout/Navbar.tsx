"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { clearAuth, getRole, getToken } from "@/lib/auth/token";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const customerLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/accounts", label: "Accounts" },
  { href: "/transactions", label: "Transactions" },
  { href: "/profile", label: "Profile" },
];

const adminLinks = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/roles", label: "Roles" },
];

const auditorLinks = [{ href: "/admin/audit", label: "Audit" }];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string[]>([]);

  const handleLogout = () => {
    clearAuth();
    setIsLoggedIn(false);
    setRole([]);
    router.push("/login");
  };

  useEffect(() => {
    setIsLoggedIn(Boolean(getToken()));
    setRole(getRole());
  }, [pathname]);

  const isAdmin = role.includes("ADMIN");
  const isAuditor = role.includes("AUDITOR");

  const navLinks = [
    ...(isLoggedIn ? customerLinks : []),
    ...(isAdmin ? adminLinks : []),
    ...(isAdmin || isAuditor ? auditorLinks : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Bank App
          </Link>

          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    active && "bg-muted text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {isLoggedIn ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Logout
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>ログアウトしますか？</AlertDialogTitle>
                    <AlertDialogDescription>
                      現在のセッションを終了してログイン画面に戻ります。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      ログアウト
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    pathname === "/login" && "bg-muted text-foreground",
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    pathname === "/register" && "bg-muted text-foreground",
                  )}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
