import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/employees": "Employees",
  "/attendance": "Attendance",
  "/payroll": "Payroll",
  "/report": "Report",
};

const searchPlaceholders = {
  "/employees": "Search employees...",
  "/attendance": "Search attendance...",
  "/payroll": "Search payroll...",
  "/report": "Search report...",
};

export default function Topbar({ search, onSearch }) {
  const location = useLocation();
  const { user } = useAuth();
  const title = pageTitles[location.pathname] || "Dashboard";
  const showSearch = Object.keys(searchPlaceholders).includes(location.pathname);

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-lg font-bold text-gray-800">{title}</h1>
        <p className="text-xs text-gray-400">Payroll Management System</p>
      </div>
      <div className="flex items-center gap-4">
        {showSearch && (
          <div className="relative hidden sm:block">
            <input
              type="text"
              value={search || ""}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholders[location.pathname] || "Search..."}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-56 bg-gray-50"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}

        {/* User */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
