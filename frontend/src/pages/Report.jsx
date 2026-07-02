// ============================================================
// Report.jsx — Full payroll summary report page
// Waxay soo aqrisaa: Employees, Attendance, Payroll
// ============================================================

import { useState, useEffect, useMemo } from "react";
import { employeeApi, attendanceApi, payrollApi } from "../services/api.jsx";
import { LoadingState, ErrorState, EmptyState } from "../components/States";

// ── Utility helpers ──────────────────────────────────────────

function fmt(num) {
  return Number(num || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function net(p) {
  return (Number(p.basicSalary) || 0) + (Number(p.allowance) || 0) - (Number(p.deduction) || 0);
}

// ── Stat Card ────────────────────────────────────────────────

function StatCard({ label, value, sub, colorClass, icon }) {
  return (
    <div className={`card p-5 flex items-center gap-4 ${colorClass.bg}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass.icon}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-800 truncate">{value}</p>
        {sub && <p className={`text-xs mt-0.5 ${colorClass.text}`}>{sub}</p>}
      </div>
    </div>
  );
}

const COLORS = {
  blue:   { bg: "bg-blue-50",   icon: "bg-blue-100 text-blue-500",   text: "text-blue-600" },
  green:  { bg: "bg-green-50",  icon: "bg-green-100 text-green-500",  text: "text-green-600" },
  yellow: { bg: "bg-yellow-50", icon: "bg-yellow-100 text-yellow-500", text: "text-yellow-600" },
  red:    { bg: "bg-red-50",    icon: "bg-red-100 text-red-500",      text: "text-red-600" },
  purple: { bg: "bg-purple-50", icon: "bg-purple-100 text-purple-500", text: "text-purple-600" },
};

// ── Badge ────────────────────────────────────────────────────

function Badge({ text, type }) {
  const cls = {
    Present: "bg-green-100 text-green-700",
    Absent:  "bg-red-100  text-red-700",
    Late:    "bg-yellow-100 text-yellow-700",
  }[text] || "bg-gray-100 text-gray-600";
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{text || "—"}</span>;
}

// ── Section header ───────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-3">
      <span className="w-1 h-4 bg-blue-500 rounded-full inline-block" />
      {children}
    </h2>
  );
}

// ── Main Component ───────────────────────────────────────────

export default function Report({ searchQuery = "" }) {
  const [employees,  setEmployees]  = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payrolls,   setPayrolls]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [empSearch,  setEmpSearch]  = useState("");
  const [paySearch,  setPaySearch]  = useState("");

  // ── Fetch all ──────────────────────────────────────────────

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    const [eRes, aRes, pRes] = await Promise.all([
      employeeApi.getAll(),
      attendanceApi.getAll(),
      payrollApi.getAll(),
    ]);
    if (!eRes.success) { setError(eRes.error); setLoading(false); return; }
    setEmployees(eRes.data  || []);
    setAttendance(aRes.success ? (aRes.data || []) : []);
    setPayrolls(pRes.success  ? (pRes.data  || []) : []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Derived stats ──────────────────────────────────────────

  const stats = useMemo(() => {
    const totalNet       = payrolls.reduce((s, p) => s + net(p), 0);
    const totalBasic     = payrolls.reduce((s, p) => s + (Number(p.basicSalary) || 0), 0);
    const totalAllowance = payrolls.reduce((s, p) => s + (Number(p.allowance)   || 0), 0);
    const totalDeduction = payrolls.reduce((s, p) => s + (Number(p.deduction)   || 0), 0);
    const presentCount   = attendance.filter(a => a.statuss === "Present").length;
    const absentCount    = attendance.filter(a => a.statuss === "Absent").length;
    return { totalNet, totalBasic, totalAllowance, totalDeduction, presentCount, absentCount };
  }, [payrolls, attendance]);

  // ── Filtered tables ────────────────────────────────────────

  const filteredEmps = useMemo(() => {
    const q = (searchQuery || empSearch).toLowerCase();
    if (!q) return employees;
    return employees.filter(e =>
      String(e.employeeID || "").includes(q) ||
      (e.fullName || "").toLowerCase().includes(q) ||
      (e.position || "").toLowerCase().includes(q)
    );
  }, [employees, empSearch, searchQuery]);

  const filteredPays = useMemo(() => {
    const q = (searchQuery || paySearch).toLowerCase();
    if (!q) return payrolls;
    return payrolls.filter(p =>
      String(p.payrollID   || "").includes(q) ||
      String(p.employeeID  || "").includes(q)
    );
  }, [payrolls, paySearch, searchQuery]);

  const filteredAttendance = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return attendance;
    return attendance.filter(a =>
      String(a.attendanceID || "").includes(q) ||
      String(a.employeeID || "").includes(q) ||
      (a.statuss || "").toLowerCase().includes(q) ||
      (a.attendanceDate || "").toLowerCase().includes(q)
    );
  }, [attendance, searchQuery]);

  // ── Attendance summary per employee ───────────────────────

  const attSummary = useMemo(() => {
    const map = {};
    attendance.forEach(a => {
      if (!map[a.employeeID]) map[a.employeeID] = { Present: 0, Absent: 0, Late: 0 };
      const key = a.statuss;
      if (map[a.employeeID][key] !== undefined) map[a.employeeID][key]++;
    });
    return map;
  }, [attendance]);

  // ── Render ─────────────────────────────────────────────────

  if (loading) return <LoadingState message="Xogta waa la soo aqrinayaa…" />;
  if (error)   return <ErrorState message={error} onRetry={fetchAll} />;

  const now = new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Payroll Report</h1>
          <p className="text-xs text-gray-400 mt-0.5">Warbixinta xogta oo dhan — {now}</p>
        </div>
     
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          label="Total Employees"
          value={employees.length}
          sub="All registered"
          colorClass={COLORS.blue}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          label="Total Net Payroll"
          value={`$${fmt(stats.totalNet)}`}
          sub={`Basic $${fmt(stats.totalBasic)}`}
          colorClass={COLORS.green}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Total Allowances"
          value={`$${fmt(stats.totalAllowance)}`}
          sub="Added benefits"
          colorClass={COLORS.purple}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
          }
        />
        <StatCard
          label="Total Deductions"
          value={`$${fmt(stats.totalDeduction)}`}
          sub="Removed from basic"
          colorClass={COLORS.red}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        {/* <StatCard
          label="Present / Absent"
          value={`${stats.presentCount} / ${stats.absentCount}`}
          sub={`${attendance.length} attendance records`}
          colorClass={COLORS.yellow}
          // icon={
          //   // <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          //   //   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          //   //     d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          //   // </svg>
          // }
        /> */}
      </div>

      {/* ── Employee Table ── */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <SectionTitle>Employees ({filteredEmps.length})</SectionTitle>
          <input
            type="text"
            placeholder="Search employees…"
            value={searchQuery || empSearch}
            onChange={e => setEmpSearch(e.target.value)}
            className="input-field w-full sm:w-56 text-sm"
          />
        </div>

        {filteredEmps.length === 0 ? (
          <EmptyState title="No employees found" />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {["ID", "Name", "Position", "Present", "Absent"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEmps.map(emp => {
                  const att = attSummary[emp.employeeID] || {};
                  return (
                    <tr key={emp.employeeID} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{emp.employeeID}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                        {emp.fullName}
                      </td>
                 
                      <td className="px-4 py-3 text-gray-600">{emp.position  }</td>
                  
                      <td className="px-4 py-3">
                        <span className="text-green-600 font-semibold">{att.Present || 0}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-red-500 font-semibold">{att.Absent || 0}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Payroll Table ── */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <SectionTitle>Payroll Records ({filteredPays.length})</SectionTitle>
          <input
            type="text"
            placeholder="Search payroll…"
            value={searchQuery || paySearch}
            onChange={e => setPaySearch(e.target.value)}
            className="input-field w-full sm:w-56 text-sm"
          />
        </div>

        {filteredPays.length === 0 ? (
          <EmptyState title="No payroll records found" />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {["Pay ID", "Emp ID", "Basic Salary", "Allowance", "Deduction", "Net Salary"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPays.map(p => {
                  const netAmt = net(p);
                  return (
                    <tr key={p.payrollID} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{p.payrollID}</td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">#{p.employeeID}</td>
                      <td className="px-4 py-3 text-gray-700">${fmt(p.basicSalary)}</td>
                      <td className="px-4 py-3 text-green-600">+${fmt(p.allowance)}</td>
                      <td className="px-4 py-3 text-red-500">-${fmt(p.deduction)}</td>
                      <td className="px-4 py-3 font-bold text-blue-700">${fmt(netAmt)}</td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Totals row */}
              <tfoot>
                <tr className="bg-blue-50 border-t-2 border-blue-100">
                  <td colSpan={2} className="px-4 py-3 text-xs font-bold text-gray-600 uppercase">Total</td>
                  <td className="px-4 py-3 font-bold text-gray-700">${fmt(stats.totalBasic)}</td>
                  <td className="px-4 py-3 font-bold text-green-600">+${fmt(stats.totalAllowance)}</td>
                  <td className="px-4 py-3 font-bold text-red-500">-${fmt(stats.totalDeduction)}</td>
                  <td className="px-4 py-3 font-bold text-blue-700 text-base">${fmt(stats.totalNet)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* ── Attendance Detail ── */}
      <div className="card p-5">
        <div className="mb-4">
          <SectionTitle>Attendance Records ({filteredAttendance.length})</SectionTitle>
        </div>
        {filteredAttendance.length === 0 ? (
          <EmptyState title="No attendance records found" />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {["Att. ID", "Emp ID", "Status"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAttendance.map((a, idx) => (
                  <tr key={a.attendenceID ?? idx} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{a.attendanceID}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">#{a.employeeID}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        <Badge text={a.statuss} />
                    </td>
                 
                 
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
