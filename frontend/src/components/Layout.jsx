import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Employees from "../pages/Employees";
import Attendance from "../pages/Attendance";
import Payroll from "../pages/Payroll";

// Pages that support search from topbar
const SEARCHABLE = ["/employees", "/attendance", "/payroll", "/report"];

export default function Layout() {
  const [search, setSearch] = useState("");
  const location = useLocation();

  const handleSearch = (val) => {
    setSearch(val);
  };

  const searchEnabled = SEARCHABLE.includes(location.pathname);

  useEffect(() => {
    if (!searchEnabled) setSearch("");
  }, [location.pathname, searchEnabled]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar search={searchEnabled ? search : ""} onSearch={searchEnabled ? handleSearch : () => setSearch("")} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet context={{ searchQuery: searchEnabled ? search : "" }} />
        </main>
      </div>
    </div>
  );
}
