import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8081";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // LOAD USER FROM TOKEN
  // =========================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      setUser({
        token,
        role: decoded.role,
      });
    } catch (err) {
      console.error("Invalid token:", err);

      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  // =========================
  // LOGIN
  // =========================

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${API_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

        let data;

        try {
          data = await res.json();
        } catch {
          data = {};
        }

        if (!res.ok) {
          throw new Error(
            data.message || "Login failed"
          );
        }

        if (!data.token) {
          throw new Error(
            "Token not received from server"
          );
        }

        const decoded = jwtDecode(data.token);

        localStorage.setItem(
          "token",
          data.token
        );

        setUser({
          email,
          token: data.token,
          role: decoded.role,
        });

        return true;
      } catch (err) {
        console.error(err);
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================
  // SIGNUP
  // =========================

  const signup = useCallback(
    async (name, email, password) => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${API_URL}/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              password,
            }),
          }
        );

        let data;

        try {
          data = await res.json();
        } catch {
          data = {};
        }

        if (!res.ok) {
          throw new Error(
            data.message || "Signup failed"
          );
        }

        if (!data.token) {
          throw new Error(
            "Token not received from server"
          );
        }

        const decoded = jwtDecode(data.token);

        localStorage.setItem(
          "token",
          data.token
        );

        setUser({
          email,
          token: data.token,
          role: decoded.role,
        });

        return true;
      } catch (err) {
        console.error(err);
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================
  // LOGOUT
  // =========================

  const logout = useCallback(() => {
    localStorage.removeItem("token");

    setUser(null);
    setError("");
  }, []);

  // =========================
  // AUTH HEADER
  // =========================

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  }, []);

  // =========================
  // FETCH PROFILE
  // =========================

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/user/profile`,
        {
          headers: getAuthHeader(),
        }
      );

      if (!res.ok) {
        throw new Error("Unauthorized");
      }

      const data = await res.json();

      return data;
    } catch (err) {
      console.error(err);
      setError(err.message);

      return null;
    }
  }, [getAuthHeader]);

  // =========================
  // UPDATE PROFILE
  // =========================

  const updateProfile = useCallback(
    (updates) => {
      setUser((prev) => {
        if (!prev) return prev;

        const updated = {
          ...prev,
          ...updates,
        };

        if (updates.name) {
          updated.avatar = updates.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
        }

        return updated;
      });
    },
    []
  );

  // =========================
  // CLEAR ERROR
  // =========================

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
        fetchProfile,
        getAuthHeader,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return ctx;
};