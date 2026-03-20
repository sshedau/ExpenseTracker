import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

// Mock user store — replace with real API calls
const MOCK_USERS = [
  {
    id: 1,
    name: "Your Name",
    email: "name@example.com",
    password: "password123",
    avatar: "HD",
    joinedDate: "January 2025",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // ── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError("");

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      setError("Invalid email or password.");
      setLoading(false);
      return false;
    }

    const { password: _, ...safeUser } = found; // never store password in state
    setUser(safeUser);
    setLoading(false);
    return true;
  }, []);

  // ── Signup ───────────────────────────────────────────────────────────────
  const signup = useCallback(async (name, email, password) => {
    setLoading(true);
    setError("");

    await new Promise((r) => setTimeout(r, 800));

    const exists = MOCK_USERS.find((u) => u.email === email);
    if (exists) {
      setError("An account with this email already exists.");
      setLoading(false);
      return false;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      avatar: name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      joinedDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    };

    MOCK_USERS.push({ ...newUser, password }); // persist to mock store
    setUser(newUser);
    setLoading(false);
    return true;
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    setError("");
  }, []);

  // ── Update Profile ───────────────────────────────────────────────────────
  const updateProfile = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };

      // Recalculate avatar initials if name changed
      if (updates.name) {
        updated.avatar = updates.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
      }

      // Sync back to mock store
      const idx = MOCK_USERS.findIndex((u) => u.id === prev.id);
      if (idx !== -1) MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...updated };

      return updated;
    });
  }, []);

  // ── Change Password ──────────────────────────────────────────────────────
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true);
    setError("");

    await new Promise((r) => setTimeout(r, 600));

    const idx = MOCK_USERS.findIndex((u) => u.id === user?.id);
    if (idx === -1 || MOCK_USERS[idx].password !== currentPassword) {
      setError("Current password is incorrect.");
      setLoading(false);
      return false;
    }

    MOCK_USERS[idx].password = newPassword;
    setLoading(false);
    return true;
  }, [user]);

  // ── Clear Error ──────────────────────────────────────────────────────────
  const clearError = useCallback(() => setError(""), []);

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
        changePassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};