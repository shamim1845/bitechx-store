"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/services/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { safeLocalStorage } from "@/utils/storage";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = useAppSelector((s) => s.auth.token);

  // Login mutation
  const [login, { isLoading }] = useLoginMutation();

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      router.replace("/products");
    }
  }, [token, router]);

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    // Perform login
    try {
      const res = await login({ email }).unwrap();
      dispatch(setCredentials({ token: res?.token || "", email: email || "" }));
      safeLocalStorage.set("jwt_token", res?.token || "");
      safeLocalStorage.set("user_email", email || "");
      router.replace("/products");
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_0%_0%,_rgba(173,138,100,0.25)_0%,_transparent_60%),radial-gradient(50%_60%_at_100%_0%,_rgba(78,110,93,0.25)_0%,_transparent_60%),radial-gradient(80%_60%_at_50%_100%,_rgba(164,74,63,0.20)_0%,_transparent_60%)]" />

      <div className="relative grid grid-cols-1 md:grid-cols-2 min-h-screen">
        {/* Left intro panel */}
        <div className="hidden md:flex flex-col justify-center p-10 lg:p-14 text-bx-fg/90">
          <div className="max-w-md space-y-6">
            <div>
              <div className="text-2xl font-semibold">BITECHX Store</div>
              <p className="text-bx-muted">Product Management Dashboard</p>
            </div>
            <div className="space-y-3 text-bx-fg/80">
              <p>
                Manage products, categories, and details with a clean,
                responsive UI.
              </p>
              <ul className="text-sm list-disc pl-5 space-y-1 text-bx-muted">
                <li>Secure auth with JWT</li>
                <li>Search, paginate, create, edit and delete</li>
                <li>Fast UI powered by Redux Toolkit + RTK Query</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right auth card */}
        <div className="flex items-center justify-center p-6 md:p-10">
          <form
            onSubmit={onSubmit}
            className="w-full max-w-md bg-bx-card/80 backdrop-blur rounded-2xl border border-bx-border p-6 md:p-8 shadow-xl space-y-5"
          >
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">Sign in</h1>
              <p className="text-sm text-bx-muted mt-1">
                Enter your email to continue.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-3 rounded-lg bg-bx-input text-bx-fg placeholder:text-bx-muted outline-none border border-bx-border focus:ring-2 focus:ring-bx-accent"
              />
              {error && (
                <div className="text-sm text-bx-danger" role="alert">
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-bx-accent text-white hover:opacity-90 disabled:opacity-60 transition"
            >
              {isLoading ? "Signing in..." : "Continue"}
            </button>

            <div className="text-xs text-bx-muted">
              By continuing, you agree to our Terms and Privacy.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
