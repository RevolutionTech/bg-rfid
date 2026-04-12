import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "bgg-app-token";

export function useAppToken() {
  const [token, setTokenState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [token]);

  const setToken = useCallback((value: string) => {
    setTokenState(value.trim());
  }, []);

  return { token, setToken };
}
