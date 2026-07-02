import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateLogin } from "../utils/validation";
import { Spinner } from "../components/States";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLogin(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const result = await login(form.username, form.password);
    setLoading(false);

    if (result.success) navigate("/dashboard");
    else setApiError(result.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white text-2xl shadow-xl shadow-blue-900/60 mx-auto mb-4">P</div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to Payroll Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* API Error */}
            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 text-sm">{apiError}</p>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
              <input
                type="text" name="username" value={form.username} onChange={handleChange}
                placeholder="Enter username"
                className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.username ? "border-red-400/60 focus:ring-red-400/30" : "border-white/10 focus:ring-blue-400/40 focus:border-blue-400/40"
                }`}
              />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                  placeholder="Enter password"
                  className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 pr-10 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.password ? "border-red-400/60 focus:ring-red-400/30" : "border-white/10 focus:ring-blue-400/40 focus:border-blue-400/40"
                  }`}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200">
                  {showPw ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 mt-2">
              {loading ? <><Spinner size="sm" /> Signing in...</> : "Sign In →"}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-slate-600 text-xs">
          <Link to="/" className="hover:text-slate-400 transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
