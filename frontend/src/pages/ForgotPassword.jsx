import { useState } from "react";
import { Mail, Wallet } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Header from "../layout/Header";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const sendResetEmail = async () => {
    if (!email.trim()) return;

    const templateParams = {
      email: email,
      reset_link: `http://localhost:5173/reset-password`
    };

    try {
      await emailjs.send(
        "service_id",
        "template_id",
        templateParams,
        "public_key"
      );

      setSent(true);
    } catch (err) {
      console.log(err);
    }
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
                Forgot Password
              </h2>

              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
                Enter your email to receive a password reset link
              </p>
            </div>

            {sent && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                Reset email sent successfully!
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 tracking-wide uppercase">
                  Email
                </label>

                <div className="relative">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${inputBase} pl-10`}
                  />

                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={sendResetEmail}
              className="mt-6 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-bold tracking-wide transition-all duration-150 shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40"
            >
              Send Reset Link
            </button>

            {/* Back to login */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium mt-6">
              Remember your password?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-colors duration-150"
              >
                Back to Login
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