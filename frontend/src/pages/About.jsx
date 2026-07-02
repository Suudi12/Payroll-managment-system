import { Link } from "react-router-dom";

const highlights = [
  { icon: "👥", title: "1.Automate Payroll Calculations", desc: "The Payroll Management System automates the entire payroll calculation process by computing employee salaries based on their basic salary,." },
  { icon: "📅", title: "2.Improve Accuracy and Efficiency", desc: "The system improves the accuracy of payroll processing by using predefined formulas and automated calculations" },
  { icon: "💰", title: "Reduce Paperwork and Human Errors", desc: "Traditional payroll systems often rely on paper documents and manual record-keeping, which can lead to misplaced files and calculation errors." },
  { icon: "🔒", title: "Save Time in Payroll Processing", desc: "By automating payroll activities such as salary calculations, payslip generation, and report creation, the system significantly reduces the time required to process payroll." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-900/50">P</div>
          <span className="text-white font-bold text-lg">Payroll MS</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2.5 transition-all">
            Home
          </Link>
          <Link to="/login" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-900/40">
            Login →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-6 text-center py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-3xl mb-6">
        About 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> Payroll Management </span>
          System
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed mb-12">
The Payroll Management System is a software application designed to simplify
 and automate the process of managing employee salaries, allowances, deductions,
  and payroll records. It helps organizations calculate wages accurately, 
generate payslips, and maintain employee payment information in a secure and organized manner.
        </p>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl w-full mb-16">
          {highlights.map(({ icon, title, desc }) => (
            <div key={title} className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl p-5 text-left transition-all hover:border-blue-500/30 cursor-default">
              <div className="text-2xl mb-3">{icon}</div>
              <h3 className="text-white font-semibold text-sm mb-1.5">{title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="max-w-3xl w-full bg-white/5 border border-white/10 rounded-xl p-8 text-left">
          <h2 className="text-white font-bold text-lg mb-3">Main point in the Project</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
          Employee management,
Salary calculation,
Allowance and deduction management,
Payroll processing,
Payslip generation,
Attendance integration,
Payroll reports,
Secure user authentication
          </p>
        </div>

  
      </main>

      {/* Footer */}
      <footer className="text-center py-5 text-slate-600 text-xs border-t border-white/5">
        © 2026 Payroll Management System
      </footer>
    </div>
  );
}
