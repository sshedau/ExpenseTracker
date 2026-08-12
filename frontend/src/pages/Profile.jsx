import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Camera,
} from "lucide-react";

import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useTheme } from "../context/ThemeContext";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8081";

function Profile() {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
    role: "",
  });

  // =========================
  // FETCH PROFILE
  // =========================

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_URL}/api/user/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(
            `Failed to fetch profile: ${res.status}`
          );
        }

        const data = await res.json();

        setUserData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          profileImage:
            data.profileImage || "",
          role: data.role || "",
        });
      } catch (err) {
        console.error(
          "Failed to fetch profile:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.token]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark
            ? "bg-slate-900"
            : "bg-slate-50"
        }`}
      >
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading profile...
        </p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-slate-900"
          : "bg-slate-50"
      }`}
    >
      {/* Grid Background */}

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

      <div className="relative max-w-5xl mx-auto px-4 py-8">

        {/* =========================
            PROFILE CARD
        ========================= */}

        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm">

          {/* Header */}

          <div className="flex items-center gap-3 mb-8">

            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">

              <User
                size={19}
                className="text-indigo-600 dark:text-indigo-400"
              />

            </div>

            <div>

              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Personal Information
              </h2>

              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                View your account information
              </p>

            </div>

          </div>

          {/* =========================
              PROFILE IMAGE
          ========================= */}

          <div className="flex flex-col items-center mb-8">

            <div className="relative">

              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">

                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User
                    size={48}
                    className="text-indigo-500"
                  />
                )}

              </div>

              {/* Camera icon */}

              <div className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">

                <Camera size={17} />

              </div>

            </div>

            <h1 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
              {userData.name || "User"}
            </h1>

            <p className="text-sm text-slate-400 dark:text-slate-500">
              {userData.role || "USER"}
            </p>

          </div>

          {/* =========================
              INFORMATION
          ========================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Full Name */}

            <div>

              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                Full Name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40 px-4 py-3">

                <User
                  size={17}
                  className="text-slate-400"
                />

                <input
                  value={userData.name}
                  readOnly
                  className="w-full bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200"
                />

              </div>

            </div>

            {/* Email */}

            <div>

              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40 px-4 py-3">

                <Mail
                  size={17}
                  className="text-slate-400"
                />

                <input
                  value={userData.email}
                  readOnly
                  className="w-full bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200"
                />

              </div>

            </div>

            {/* Phone */}

            <div>

              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                Phone Number
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40 px-4 py-3">

                <Phone
                  size={17}
                  className="text-slate-400"
                />

                <input
                  value={
                    userData.phone ||
                    "Not provided"
                  }
                  readOnly
                  className="w-full bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200"
                />

              </div>

            </div>

            {/* Account Role */}

            <div>

              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                Account Type
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40 px-4 py-3">

                <User
                  size={17}
                  className="text-slate-400"
                />

                <input
                  value={
                    userData.role || "USER"
                  }
                  readOnly
                  className="w-full bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200"
                />

              </div>

            </div>

          </div>

          {/* Account Info */}

          <div className="mt-6 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">

            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              Your profile information can be edited from the Account settings.
            </p>

          </div>

        </div>

        <Footer />

      </div>

    </div>
  );
}

export default Profile;