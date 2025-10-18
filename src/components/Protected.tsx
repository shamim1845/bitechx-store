"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { safeLocalStorage } from "@/utils/storage";
import { setCredentials } from "@/store/slices/authSlice";

export default function Protected({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((s) => s.auth.token);
  const email = useAppSelector((s) => s.auth.email);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If we already have a token, we're good
    if (token) {
      setChecking(false);
      return;
    }
    // Try to hydrate from localStorage
    const lsToken = safeLocalStorage.get("jwt_token");
    const lsEmail = safeLocalStorage.get("user_email");
    if (lsToken && lsEmail) {
      dispatch(setCredentials({ token: lsToken, email: lsEmail }));
      setChecking(false);
      return;
    }
    // No token anywhere → redirect
    router.replace("/login");
    setChecking(false);
  }, [token, email, dispatch, router]);

  if (checking) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_0%_0%,_rgba(173,138,100,0.25)_0%,_transparent_60%),radial-gradient(50%_60%_at_100%_0%,_rgba(78,110,93,0.25)_0%,_transparent_60%),radial-gradient(80%_60%_at_50%_100%,_rgba(164,74,63,0.20)_0%,_transparent_60%)]" />
        <div className="relative min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-bx-card/80 backdrop-blur rounded-2xl border border-bx-border p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 h-10 w-10 border-2 border-bx-border border-t-bx-accent rounded-full animate-spin" />
            <div className="text-lg font-medium">Checking authentication…</div>
            <p className="text-sm text-bx-muted mt-1">Please wait a moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
