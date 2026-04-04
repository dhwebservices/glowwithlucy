import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/api";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [state, setState] = useState({
    loading: true,
    authenticated: false,
    email: null,
  });

  useEffect(() => {
    apiRequest("/api/admin/session")
      .then((data) => {
        setState({
          loading: false,
          authenticated: Boolean(data.authenticated),
          email: data.email || null,
        });
      })
      .catch(() => {
        setState({
          loading: false,
          authenticated: false,
          email: null,
        });
      });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      async login(email, password) {
        const data = await apiRequest("/api/admin/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        setState({
          loading: false,
          authenticated: true,
          email: data.email,
        });
      },
      async logout() {
        await apiRequest("/api/admin/logout", { method: "POST" });
        setState({
          loading: false,
          authenticated: false,
          email: null,
        });
      },
    }),
    [state]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
