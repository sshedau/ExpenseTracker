import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Wallet,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Header from "../layout/Header";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8081";

export default function ResetPassword() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputBase =
    "w-full rounded-xl border bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-sm font-medium px-4 py-3 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 border-slate-200 dark:border-slate-600 placeholder:text-slate-400 dark:placeholder:text-slate-500";

  // =========================
  // RESET PASSWORD
  // =========================

  const resetPassword = async () => {
    setError("");

    if (!password || !confirmPassword) {
      setError(
        "Please enter and confirm your new password."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError(
        "Invalid or missing password reset token."
      );
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/auth/reset-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token: token,
            newPassword: password,
          }),
        }
      );

      let data;

      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Failed to reset password."
        );
      }

      setSuccess(true);

      setPassword("");
      setConfirmPassword("");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark
          ? "bg-slate-900"
          : "bg-slate-50"
      }`}
    >

      {/* Grid background */}

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(
            ${isDark ? "#ffffff" : "#000000"} 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            ${isDark ? "#ffffff" : "#000000"} 1px,
            transparent 1px
          )`,
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

                <Wallet
                  size={22}
                  className="text-white"
                />

              </div>

              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Reset Password
              </h2>

              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
                Enter your new password below
              </p>

            </div>

            {/* Success message */}

            {success && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">

                <CheckCircle size={16} />

                Password reset successfully. Redirecting to login...

              </div>
            )}

            {/* Error message */}

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">

                <AlertCircle size={16} />

                {error}

              </div>
            )}

            {!success && (
              <div className="space-y-5">

                {/* New Password */}

                <div>

                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 tracking-wide uppercase">
                    New Password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      className={`${inputBase} pl-10 pr-10`}
                    />

                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>

                  </div>

                  <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                    Password must be at least 6 characters.
                  </p>

                </div>

                {/* Confirm Password */}

                <div>

                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 tracking-wide uppercase">
                    Confirm Password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      className={`${inputBase} pl-10 pr-10`}
                    />

                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Reset Button */}

                <button
                  onClick={resetPassword}
                  disabled={loading}
                  className={`w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-bold tracking-wide transition-all duration-150 shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 ${
                    loading
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loading
                    ? "Resetting Password..."
                    : "Reset Password"}
                </button>

              </div>
            )}

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