import { useRef, useEffect, useState } from "react";
import {
  Sun,
  Moon,
  Monitor,
  Settings,
  User,
  SlidersHorizontal,
  Palette,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Check,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8081";

function SettingsDropdown({ onClose, buttonRef, isLoggedIn }) {
  const { isDark, toggle, resetToSystem, override, systemTheme } = useTheme();
  const [showThemeSubmenu, setShowThemeSubmenu] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!user?.token) return;

      try {
        const res = await fetch(`${API_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();

        setProfileImage(data.profileImage || "");
      } catch (err) {
        console.error("Failed to load profile image", err);
      }
    };

    fetchProfileImage();
  }, [user?.token]);

  useEffect(() => {
    const handler = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !buttonRef.current?.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const currentThemeLabel =
    override === null ? "System" : override === "dark" ? "Dark" : "Light";

  const menuSections = isLoggedIn
    ? [
        {
          items: [
            {
              icon: User,
              label: "Profile",
              sub: "View your profile",
              action: () => {
                navigate("/profile");
                onClose();
              },
            },
            {
              icon: SlidersHorizontal,
              label: "Account Settings",
              sub: "Update personal info",
              action: () => {
                navigate("/account");
                onClose();
              },
            },
          ],
        },
        {
          items: [
            {
              icon: Palette,
              label: "Appearance",
              sub: currentThemeLabel,
              hasSubmenu: true,
              action: () => setShowThemeSubmenu((v) => !v),
            },
            {
              icon: Bell,
              label: "Notifications",
              sub: "Manage alerts",
              action: () => {
                navigate("/notifications");
                onClose();
              },
            },
          ],
        },
        {
          items: [
            {
              icon: HelpCircle,
              label: "Help & Support",
              sub: "Docs & contact",
              action: () => {
                navigate("/help");
                onClose();
              },
            },
          ],
        },
        {
          items: [
            {
              icon: LogOut,
              label: "Log Out",
              sub: "Sign out of Ledger",
              danger: true,
              action: () => {
                logout();
                navigate("/", { replace: true });
                onClose();
              },
            },
          ],
        },
      ]
    : [
        {
          items: [
            {
              icon: Palette,
              label: "Appearance",
              sub: currentThemeLabel,
              hasSubmenu: true,
              action: () => setShowThemeSubmenu((v) => !v),
            },
            {
              icon: Bell,
              label: "Notifications",
              sub: "Manage alerts",
              action: () => {
                navigate("/notifications");
                onClose();
              },
            },
            {
              icon: HelpCircle,
              label: "Help & Support",
              sub: "Docs & contact",
              action: () => {
                navigate("/help");
                onClose();
              },
            },
          ],
        },
      ];

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-xl shadow-slate-200/60 dark:shadow-slate-900/70 overflow-hidden z-50
        animate-in fade-in slide-in-from-top-2 duration-200"
      style={{ animation: "dropdownIn 0.18s ease forwards" }}
    >
      {/* User info strip */}
      {isLoggedIn && (
        <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-700/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-500/30">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xs font-black">
                  {user?.avatar || user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Menu sections */}
      <div className="py-1.5 max-h-96 overflow-y-auto">
        {menuSections.map((section, si) => (
          <div key={si}>
            {si > 0 && (
              <div className="my-1 mx-3 h-px bg-slate-100 dark:bg-slate-700/60" />
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label}>
                  <button
                    onClick={item.action}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 mx-0 rounded-xl transition-all duration-150 group
                      ${
                        item.danger
                          ? "hover:bg-rose-50 dark:hover:bg-rose-900/20"
                          : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150
                      ${
                        item.danger
                          ? "bg-rose-100 dark:bg-rose-900/30 text-rose-500"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                      }`}
                    >
                      <Icon size={13} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p
                        className={`text-sm font-semibold leading-none mb-0.5
                        ${
                          item.danger
                            ? "text-rose-500"
                            : "text-slate-800 dark:text-slate-100"
                        }`}
                      >
                        {item.label}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {item.sub}
                      </p>
                    </div>
                    {item.hasSubmenu && (
                      <ChevronRight
                        size={13}
                        className={`text-slate-400 transition-transform duration-200 ${showThemeSubmenu ? "rotate-90" : ""}`}
                      />
                    )}
                  </button>

                  {/* Theme submenu */}
                  {item.hasSubmenu && showThemeSubmenu && (
                    <div className="mx-3 mb-1 rounded-xl border border-slate-100 dark:border-slate-700/60 overflow-hidden bg-slate-50 dark:bg-slate-700/30">
                      {[
                        { label: "Light", icon: Sun, value: "light" },
                        { label: "Dark", icon: Moon, value: "dark" },
                        { label: "System", icon: Monitor, value: "system" },
                      ].map((opt) => {
                        const OptIcon = opt.icon;
                        const isActive =
                          opt.value === "system"
                            ? override === null
                            : override === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => {
                              if (opt.value === "system") resetToSystem();
                              else if (opt.value === "dark" && !isDark)
                                toggle();
                              else if (opt.value === "light" && isDark)
                                toggle();
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 transition-colors duration-150
                              ${
                                isActive
                                  ? "text-indigo-600 dark:text-indigo-400"
                                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                              }`}
                          >
                            <OptIcon size={13} />
                            <span className="text-xs font-semibold flex-1 text-left">
                              {opt.label}
                            </span>
                            {isActive && (
                              <Check size={12} className="text-indigo-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Version tag */}
      <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-700/20">
        <p className="text-[10px] text-slate-300 dark:text-slate-600 font-medium text-center tracking-wide">
          Ledger v1.0.0 · Personal Finance
        </p>
      </div>

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
}

const SettingsLayout = () => {
  const { isDark, toggle, override } = useTheme();
  const isOverriding = override !== null;
  const ThemeIcon = isOverriding ? (isDark ? Moon : Sun) : Monitor;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const buttonRef = useRef(null);
  const { user } = useAuth();
  const isLoggedIn = !!user;
  return (
    <div>
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setSettingsOpen((v) => !v)}
          title="Settings"
          className={`w-9 h-9 rounded-xl border transition-all duration-200 flex items-center justify-center
              ${
                settingsOpen
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/30"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              }`}
        >
          <Settings
            size={15}
            className={
              settingsOpen
                ? "rotate-45 transition-transform duration-300"
                : "transition-transform duration-300"
            }
          />
        </button>

        {settingsOpen && (
          <SettingsDropdown
            buttonRef={buttonRef}
            onClose={() => setSettingsOpen(false)}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>
    </div>
  );
};

export default SettingsLayout;
