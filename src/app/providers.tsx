"use client";
import { useEffect } from "react";
import { Provider } from "react-redux";

import { store } from "../store";
import { setCredentials } from "../store/slices/authSlice";
import { safeLocalStorage } from "../utils/storage";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check for stored credentials on mount
  useEffect(() => {
    const token = safeLocalStorage.get("jwt_token");
    const email = safeLocalStorage.get("user_email");

    if (token && email) {
      store.dispatch(setCredentials({ token, email }));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
