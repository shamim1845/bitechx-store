"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuth } from "@/store/slices/authSlice";
import { safeLocalStorage } from "@/utils/storage";

export default function Header() {
  const [open, setOpen] = useState(false);

  const email = useAppSelector((store) => store.auth.email);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Handle logout
  const logout = () => {
    dispatch(clearAuth());
    safeLocalStorage.remove("jwt_token");
    safeLocalStorage.remove("user_email");
    router.replace("/login");
    setOpen(false);
  };

  return (
    <header className="w-full border-b border-bx-border/60 bg-bx-card">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/products" className="font-semibold">
          BITECHX Store
        </Link>
        <div className="flex items-center gap-2 sm:hidden">
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="px-3 h-9 rounded bg-bx-input border border-bx-border"
          >
            {open ? "×" : "☰"}
          </button>
        </div>
        <nav className="hidden sm:flex items-center gap-3 text-sm">
          <Link href="/products" className="hover:underline">
            Products
          </Link>
          <Link href="/products/new" className="hover:underline">
            Create
          </Link>
          {email ? (
            <button
              onClick={logout}
              className="ml-3 px-3 h-9 rounded bg-bx-input border border-bx-border"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="ml-3 px-3 h-9 rounded bg-bx-accent text-white flex items-center justify-center"
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile right sidebar */}
      {open && (
        <div className="sm:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-72 max-w-[80vw] bg-bx-card border-l border-bx-border/60 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Menu</span>
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="px-3 h-9 rounded bg-bx-input border border-bx-border"
              >
                ×
              </button>
            </div>
            <nav className="space-y-3 text-sm">
              <Link
                href="/products"
                className="block"
                onClick={() => setOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/products/new"
                className="block"
                onClick={() => setOpen(false)}
              >
                Create
              </Link>
              {email ? (
                <button
                  onClick={logout}
                  className="px-3 h-9 rounded bg-bx-input border border-bx-border w-full text-left"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
