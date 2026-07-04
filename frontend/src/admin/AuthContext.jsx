import { createContext, useContext, useEffect, useState } from "react";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("aatreya_admin_token");
    const cached = localStorage.getItem("aatreya_admin_user");
    if (!token) {
      setLoading(false);
      return;
    }
    if (cached) {
      try { setUser(JSON.parse(cached)); } catch { /* noop */ }
    }
    api.get("/auth/me")
      .then((r) => {
        setUser(r.data);
        localStorage.setItem("aatreya_admin_user", JSON.stringify(r.data));
      })
      .catch(() => {
        localStorage.removeItem("aatreya_admin_token");
        localStorage.removeItem("aatreya_admin_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (mobile, password) => {
    const { data } = await api.post("/auth/login", { mobile, password });
    localStorage.setItem("aatreya_admin_token", data.access_token);
    localStorage.setItem("aatreya_admin_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("aatreya_admin_token");
    localStorage.removeItem("aatreya_admin_user");
    setUser(null);
    window.location.href = "/admin/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
