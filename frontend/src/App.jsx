import { BrowserRouter, Routes, Route, Navigate, useOutletContext } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import Report from "./pages/Report";   // ← cusub

// Wrapper to pass searchQuery from Layout outlet context to each page
function WithSearch(Component) {
  return function WrappedPage() {
    const ctx = useOutletContext() || {};
    return <Component searchQuery={ctx.searchQuery || ""} />;
  };
}

const EmpPage  = WithSearch(Employees);
const AttPage  = WithSearch(Attendance);
const PayPage  = WithSearch(Payroll);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: "10px", background: "#1e293b", color: "#f1f5f9", fontSize: "13px" },
            success: { iconTheme: { primary: "#10b981", secondary: "#f1f5f9" } },
            error:   { iconTheme: { primary: "#ef4444", secondary: "#f1f5f9" } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/"      element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />

          {/* Protected — all inside Layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/employees"  element={<EmpPage />} />
            <Route path="/attendance" element={<AttPage />} />
            <Route path="/payroll"    element={<PayPage />} />
            <Route path="/report"     element={<Report />} />  {/* ← cusub */}
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
