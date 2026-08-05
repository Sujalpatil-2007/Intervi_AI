import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await getCurrentUser();

      setUser(response.user || response.data || null);

      return response.user || response.data || null;
    } catch (error) {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    async function initialize() {
      await refreshUser();
      setIsInitializing(false);
    }

    initialize();
  }, []);

  const clearUser = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      clearUser,
      refreshUser,
      isAuthenticated: !!user,
      isInitializing,
    }),
    [user, isInitializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
