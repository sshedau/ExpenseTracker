import { useState } from "react";
import { Wallet, Eye, EyeOff } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Header from "../layout/Header";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { isDark } = useTheme();
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;

    clearError();
    const ok = await login(email, password);

    if (ok) navigate("/dashboard");
  };

  const inputBase =
    "w-full rounded-xl border bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-sm font-medium px-4 py-3 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 border-slate-200 dark:border-slate-600 placeholder:text-slate-400 dark:placeholder:text-slate-500";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(${
            isDark ? "#ffffff" : "#000000"
          } 1px, transparent 1px), linear-gradient(90deg, ${
            isDark ? "#ffffff" : "#000000"
          } 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <Header />

      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60 p-8">

            {/* Heading */}
            <div className="mb-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mx-auto mb-4">
                <Wallet size={22} className="text-white" />
              </div>

              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Welcome back
              </h2>

              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
                Sign in to your Ledger account
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Fields */}
            <div className="space-y-4">

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 tracking-wide uppercase">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputBase}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide uppercase">
                    Password
                  </label>

                  <button
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors duration-150"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputBase} pr-11`}
                  />

                  <button
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-150"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-bold tracking-wide transition-all duration-150 shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                or
              </span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-colors duration-150"
              >
                Create one
              </button>
            </p>

          </div>
        </div>
      </div>

      <div className="relative pb-6 text-center">
        <p className="text-[11px] font-medium text-slate-300 dark:text-slate-600 tracking-wide">
          Expense Tracker · Personal Finance Dashboard
        </p>
      </div>
    </div>
  );
}