import { useEffect, useState, useRef } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useTheme } from "../context/ThemeContext";

import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Camera,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8081";

const Account = () => {
  const { isDark } = useTheme();
  const { user: authUser } = useAuth();

  // =========================
  // Profile
  // =========================

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef(null);

  const [touched, setTouched] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // =========================
  // Password
  // =========================

  const [passwordForm, setPasswordForm] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [updatingPassword, setUpdatingPassword] = useState(false);

  // =========================
  // Messages
  // =========================

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // Delete
  // =========================

  const [deleting, setDeleting] = useState(false);

  // =========================
  // Fetch Profile
  // =========================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!authUser?.token) {
          setError("Session expired. Please login again.");
          return;
        }

        const res = await fetch(`${API_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        });

        if (res.status === 401) {
          setError("Session expired. Please login again.");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();

        setUser({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          profileImage: data.profileImage || "",
        });

        setImagePreview(data.profileImage || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      }
    };

    if (authUser?.token) {
      fetchProfile();
    }
  }, [authUser?.token]);

  // =========================
  // Profile Change
  // =========================

  const handleProfileChange = (e) => {
    setTouched(true);
    setError("");
    setSuccess("");

    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Save Profile
  // =========================

  const handleSaveProfile = async () => {
    setError("");
    setSuccess("");

    if (!user.name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    if (!authUser?.token) {
      setError("Session expired. Please login again.");
      return;
    }

    if (!touched) {
      return;
    }

    try {
      setSavingProfile(true);

      const res = await fetch(`${API_URL}/api/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser.token}`,
        },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
        }),
      });

      if (res.status === 401) {
        setError("Session expired. Please login again.");
        return;
      }

      if (!res.ok) {
        throw new Error("Update failed");
      }

      setSuccess("Profile updated successfully.");
      setTouched(false);
    } catch (err) {
      console.error(err);
      setError("Error updating profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // =========================
  // Password Change
  // =========================

  const handlePasswordChange = (e) => {
    setError("");
    setSuccess("");

    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatePassword = async () => {
    setError("");
    setSuccess("");

    if (!authUser?.token) {
      setError("Session expired. Please login again.");
      return;
    }

    if (!passwordForm.password) {
      setError("Please enter your current password.");
      return;
    }

    if (!passwordForm.newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (passwordForm.password === passwordForm.newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    try {
      setUpdatingPassword(true);

      const res = await fetch(
        `${API_URL}/api/user/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUser.token}`,
          },
          body: JSON.stringify({
            password: passwordForm.password,
            newPassword: passwordForm.newPassword,
          }),
        }
      );

      let data = {};

      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.status === 401) {
        setError("Session expired. Please login again.");
        return;
      }

      if (!res.ok) {
        throw new Error(
          data.message || "Password update failed."
        );
      }

      setSuccess("Password updated successfully.");

      setPasswordForm({
        password: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Error updating password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  // =========================
  // Delete Account
  // =========================

  const handleDeleteAccount = async () => {
    setError("");
    setSuccess("");

    if (!authUser?.token) {
      setError("Session expired. Please login again.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleting(true);

      const res = await fetch(`${API_URL}/api/user/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      });

      let data = {};

      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data.message || "Delete failed.");
      }

      localStorage.removeItem("token");

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError(err.message || "Error deleting account.");
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // Image Change
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    setProfileImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // =========================
  // Upload Image
  // =========================

  const handleUploadImage = async () => {
    if (!profileImage) {
      setError("Please select an image first.");
      return;
    }

    if (!authUser?.token) {
      setError("Session expired. Please login again.");
      return;
    }

    try {
      setUploadingImage(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("image", profileImage);

      const res = await fetch(
        `${API_URL}/api/user/profile-image`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
          body: formData,
        }
      );

      let data = {};

      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.status === 401) {
        setError("Session expired. Please login again.");
        return;
      }

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to upload profile image."
        );
      }

      setImagePreview(data.profileImage);

      setUser((prev) => ({
        ...prev,
        profileImage: data.profileImage,
      }));

      setProfileImage(null);

      setSuccess("Profile image updated successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to upload profile image."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // =========================
  // Validation
  // =========================

  const isValidProfile = user.name.trim().length >= 2;

  // =========================
  // UI
  // =========================

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-slate-900" : "bg-slate-50"
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

      <div className="relative max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Global Messages */}

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-sm font-medium">
            <AlertCircle size={17} />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            <CheckCircle size={17} />
            {success}
          </div>
        )}

        {/* Profile */}

        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm">

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <User
                size={19}
                className="text-indigo-600 dark:text-indigo-400"
              />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Profile Information
              </h2>

              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Manage your personal information
              </p>
            </div>
          </div>

          <div className="space-y-5">

            {/* Profile Image */}

            <div className="flex flex-col items-center mb-7">
              <div className="relative">

                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">

                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User
                      size={42}
                      className="text-indigo-500"
                    />
                  )}

                </div>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition"
                >
                  <Camera size={17} />
                </button>

              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
                JPG, PNG or WebP · Max 5 MB
              </p>

              {profileImage && (
                <button
                  type="button"
                  onClick={handleUploadImage}
                  disabled={uploadingImage}
                  className="mt-3 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition disabled:opacity-60"
                >
                  {uploadingImage
                    ? "Uploading..."
                    : "Upload Photo"}
                </button>
              )}

            </div>

            {/* Name */}

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                Full Name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40 px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/30">

                <User size={17} className="text-slate-400" />

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={user.name}
                  onChange={handleProfileChange}
                  className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                />

              </div>
            </div>

            {/* Email */}

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/30 px-4 py-3">

                <Mail size={17} className="text-slate-400" />

                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full bg-transparent outline-none text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />

              </div>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                Email changes require verification.
              </p>
            </div>

            {/* Phone */}

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                Phone Number
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40 px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/30">

                <Phone size={17} className="text-slate-400" />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={user.phone}
                  onChange={handleProfileChange}
                  className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                />

              </div>
            </div>

          </div>

          <button
            onClick={handleSaveProfile}
            disabled={
              !isValidProfile ||
              !touched ||
              savingProfile
            }
            className={`mt-6 px-5 py-2.5 rounded-xl text-sm font-bold transition ${
              isValidProfile &&
              touched &&
              !savingProfile
                ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
                : "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            }`}
          >
            {savingProfile
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

        {/* Security */}

        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <ShieldCheck
                size={19}
                className="text-indigo-600 dark:text-indigo-400"
              />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Security
              </h2>

              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Keep your account secure
              </p>
            </div>

          </div>

          <div className="space-y-4">

            {/* Current Password */}

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                Current Password
              </label>

              <div className="relative flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40 px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/30">

                <Lock size={17} className="text-slate-400" />

                <input
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Current Password"
                  value={passwordForm.password}
                  onChange={handlePasswordChange}
                  className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 pr-8"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(
                      !showCurrentPassword
                    )
                  }
                  className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>
            </div>

            {/* New Password */}

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                New Password
              </label>

              <div className="relative flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40 px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/30">

                <Lock size={17} className="text-slate-400" />

                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  name="newPassword"
                  placeholder="New Password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 pr-8"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                  className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showNewPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>
            </div>

            {/* Confirm Password */}

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                Confirm New Password
              </label>

              <div className="relative flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40 px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/30">

                <Lock size={17} className="text-slate-400" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 pr-8"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>
            </div>

          </div>

          <button
            onClick={handleUpdatePassword}
            disabled={updatingPassword}
            className="mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition shadow-md shadow-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {updatingPassword
              ? "Updating..."
              : "Update Password"}
          </button>

        </div>

        {/* Danger Zone */}

        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-red-200 dark:border-red-500/30 p-6 shadow-sm">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <Trash2
                size={19}
                className="text-red-500"
              />
            </div>

            <div>
              <h2 className="text-sm font-bold text-red-500">
                Danger Zone
              </h2>

              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Permanently delete your account and data
              </p>
            </div>

          </div>

          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {deleting
              ? "Deleting..."
              : "Delete Account"}
          </button>

        </div>

        <Footer />

      </div>
    </div>
  );
};

export default Account;