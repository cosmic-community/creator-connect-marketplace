"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useRef,
  createElement,
  type ReactNode,
} from "react";
import { AuthUser } from "@/types";
import { verifyToken } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (token: string, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const mounted = useRef<boolean>(true);
  const initializingRef = useRef<boolean>(false);

  // Safe localStorage access
  const getStoredToken = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem("auth_token");
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      return null;
    }
  }, []);

  const getStoredUser = useCallback((): AuthUser | null => {
    if (typeof window === "undefined") return null;
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      return null;
    }
  }, []);

  const setStoredAuth = useCallback(
    async (token: string, userData: AuthUser): Promise<void> => {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.error("Failed to store auth data:", error);
        throw new Error("Failed to store authentication data");
      }
    },
    []
  );

  const clearStoredAuth = useCallback((): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      localStorage.removeItem("signup_email");
    } catch (error) {
      console.error("Failed to clear auth data:", error);
    }
  }, []);

  // Initialize authentication state
  const initializeAuth = useCallback(async (): Promise<void> => {
    if (initializingRef.current) return;
    initializingRef.current = true;

    try {
      const token = getStoredToken();

      if (!token) {
        if (mounted.current) {
          setState((prev) => ({ ...prev, isLoading: false, error: null }));
        }
        return;
      }

      // Verify token
      const verifiedUser = verifyToken(token);

      if (verifiedUser && mounted.current) {
        setState({
          user: verifiedUser,
          isLoading: false,
          error: null,
        });
      } else {
        // Token is invalid, clear storage
        clearStoredAuth();
        if (mounted.current) {
          setState({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      clearStoredAuth();
      if (mounted.current) {
        setState({
          user: null,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Authentication initialization failed",
        });
      }
    } finally {
      initializingRef.current = false;
    }
  }, [getStoredToken, clearStoredAuth]);

  // Initialize on mount
  useEffect(() => {
    mounted.current = true;
    initializeAuth();

    return () => {
      mounted.current = false;
    };
  }, [initializeAuth]);

  const login = useCallback(
    async (token: string, userData: AuthUser): Promise<void> => {
      try {
        // Validate input parameters
        if (!token || typeof token !== "string") {
          throw new Error("Invalid token provided");
        }

        if (!userData || !userData.id || !userData.email) {
          throw new Error("Invalid user data provided");
        }

        // Store authentication data
        await setStoredAuth(token, userData);

        if (mounted.current) {
          setState({
            user: userData,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";

        if (mounted.current) {
          setState((prev) => ({
            ...prev,
            error: errorMessage,
            isLoading: false,
          }));
        }
        throw error;
      }
    },
    [setStoredAuth]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      clearStoredAuth();

      if (mounted.current) {
        setState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear the user state even if localStorage fails
      if (mounted.current) {
        setState((prev) => ({
          ...prev,
          user: null,
          error: error instanceof Error ? error.message : "Logout failed",
        }));
      }
    }
  }, [clearStoredAuth]);

  const clearError = useCallback((): void => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const contextValue: AuthContextType = {
    user: state.user,
    isAuthenticated: !!state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    clearError,
  };

  return createElement(AuthContext.Provider, { value: contextValue }, children);
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Type guard for checking if user has specific account type
export function isContentCreator(
  user: AuthUser | null
): user is AuthUser & { accountType: "content-creator" } {
  return user?.accountType === "content-creator";
}

export function isProductCreator(
  user: AuthUser | null
): user is AuthUser & { accountType: "product-creator" } {
  return user?.accountType === "product-creator";
}

// Hook for checking authentication status without subscribing to changes
export function useAuthStatus(): {
  isAuthenticated: boolean;
  isLoading: boolean;
} {
  const { isAuthenticated, isLoading } = useAuth();
  return { isAuthenticated, isLoading };
}
