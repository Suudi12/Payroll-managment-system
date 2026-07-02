import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { employeeApi, attendanceApi, payrollApi } from "../services/api.jsx";
import { LoadingState, ErrorState } from "../components/States";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function StatCard({ label, value, sub, color, icon, to }) {
  const colors = {
    blue:   { bg: "bg-blue-50",   icon: "bg-blue-100  text-blue-500",  text: "text-blue-600" },
    green:  { bg: "bg-green-50",  icon: "bg-green-100 text-green-500", text: "text-green-600" },
    yellow: { bg: "bg-yellow-50", icon: "bg-yellow-100 text-yellow-500", text: "text-yellow-600" },
    purple: { bg: "bg-purple-50", icon: "bg-purple-100 text-purple-500", text: "text-purple-600" },
  }[color] || {};

  return (
    <Link to={to} className={`card p-5 flex items-center gap-4 hover:shadow-md transition-shadow ${colors.bg}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.icon}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className={`text-xs mt-0.5 ${colors.text}`}>{sub}</p>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    setLoading(true); setError("");
    const [e, a, p] = await Promise.all([
      employeeApi.getAll(), attendanceApi.getAll(), payrollApi.getAll()
    ]);
    if (!e.success) { setError(e.error); setLoading(false); return; }
    setEmployees(e.data || []);
    setAttendance(a.success ? (a.data || []) : []);
    setPayrolls(p.success ? (p.data || []) : []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  if (loading) return <LoadingState message="Loading dashboard data..." />;
  if (error)   return <ErrorState message={error} onRetry={fetchAll} />;

  const totalPayroll = payrolls.reduce((s, p) => s + (p.basicSalary + p.allowance - p.deduction), 0);
  const totalDeductions = payrolls.reduce((s, p) => s + p.deduction, 0);
  const presentToday = attendance.filter(a => a.statuss === "Present").length;

  // Chart data — group payroll by employee
  const chartData = payrolls.slice(0, 6).map((p, i) => ({
    name: `Emp ${p.employeeID}`,
    salary: p.basicSalary + p.allowance - p.deduction,
  }));

  return (
    <div className="space-y-6 animate-fadeIn w-full">
     
    
    
      <div className="grid grid-cols-1 gap-5 w-full">
        <div className="space-y-5 w-full">
          {/* Recent Employees */}
          <div className="card p-5  w-full">
           
          <h2 className="font-semibold text-gray-800">Recent Employees</h2><br />
              <Link to="/employees" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All →</Link>
           
            {employees.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No employees. Add one from the Employees page.</p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left bg-gray-50 text-gray-500">
                      <th className="px-4 py-3 font-medium">ID</th>
                      <th className="px-4 py-3 font-medium">Employee</th>
                      <th className="px-4 py-3 font-medium">Position</th>
                      <th className="px-4 py-3 font-medium">Hire Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.slice(0, 20).map(emp => (
                      <tr key={emp.employeeID} className="border-t border-gray-100 hover:bg-blue-50/40 transition-colors">
                        <td className="px-4 py-3 text-gray-400">#{emp.employeeID}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                          
                            <div>
                              <p className="font-medium text-gray-800">{emp.fullName}</p>
                           
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">{emp.position}</span></td>
                        <td className="px-4 py-3 text-gray-500">{emp.hireDate?.slice(0,10)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

       
        </div>

      </div>

      <p className="text-center text-xs text-gray-300 pb-2 text-black/50">© 2026 Payroll Management System. All rights reserved.</p>
    </div>
  );
}
