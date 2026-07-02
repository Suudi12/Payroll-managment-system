import { createContext, useContext, useState } from "react";
import { userApi } from "../services/api.jsx";

const AuthContext = createContext(null);

// Reads a field off the user record regardless of the exact casing/typo
// the backend returns (e.g. "passwowr" vs "password", "statuse" vs "status").
function pick(obj, ...keys) {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return undefined;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("pms_user")) || null; }
    catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  // Login is verified against the real Users table via GET /api/User
  // (columns: username, passwowr, statuse) — no more manual/demo accounts.
  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await userApi.getAll();
      if (!res.success) {
        return { success: false, error: res.error || "Khalad ayaa ka yimid server-ka. Hubi in backend-ku shaqeynayo." };
      }

      const users = Array.isArray(res.data) ? res.data : [];
      const match = users.find((u) => {
        const uName = String(pick(u, "username", "Username") || "").toLowerCase();
        const uPass = String(pick(u, "passwowr", "Passwowr", "password", "Password") || "");
        return uName === username.trim().toLowerCase() && uPass === password;
      });

      if (!match) {
        return { success: false, error: "Username ama Password khalad ah." };
      }

      // "statuse" in this table holds the user's role (e.g. HR, Admin).
      const sessionUser = {
        username: pick(match, "username", "Username"),
        role: pick(match, "statuse", "Statuse", "role", "Role") || "User",
        name: pick(match, "fullName", "FullName") || pick(match, "username", "Username"),
      };

      setUser(sessionUser);
      sessionStorage.setItem("pms_user", JSON.stringify(sessionUser));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Khalad ayaa dhacay marka la xaqiijinayey." };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("pms_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
