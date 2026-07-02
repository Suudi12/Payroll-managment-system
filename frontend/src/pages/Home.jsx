import { Link } from "react-router-dom";

const features = [
  { icon: "👥", title: "Employee Management", desc: "Add, edit, and manage all your employees in one place." },
  { icon: "📅", title: "Attendance Tracking", desc: "Track daily attendance — Present, Absent, or Late." },
  { icon: "💰", title: "Payroll Processing", desc: "Calculate salaries with allowances and deductions automatically." },
  { icon: "ℹ️", title: "Ku saabsan Project-ka", desc: "Baro wax ku saabsan nidaamka Payroll Management System." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-900/50">P</div>
          <span className="text-white font-bold text-lg">Payroll MS</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/about" className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2.5 transition-all">
            About
          </Link>
          <Link to="/login" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-900/40">
            Login →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        

        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight max-w-3xl mb-6">
          Payroll
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> Management </span>
          System
        </h1>

    

        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/login" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-xl shadow-blue-900/50 text-sm">
            Get Started →
          </Link>
      
        </div>

      
        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-4xl w-full">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl p-5 text-left transition-all hover:border-blue-500/30 cursor-default">
              <div className="text-2xl mb-3">{icon}</div>
              <h3 className="text-white font-semibold text-sm mb-1.5">{title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-5 text-slate-600 text-xs border-t border-white/5 mt-200 text-black/50 ">
        © 2026 Payroll Management System
      </footer>
    </div>
  );
}
