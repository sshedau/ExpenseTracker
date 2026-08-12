import React, { useEffect, useState } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useTheme } from "../context/ThemeContext";
import {
  Mail,
  MessageCircleQuestion,
  Send,
  ChevronDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8081";

const HelpNSupport = () => {
  const { isDark } = useTheme();
  const { user: authUser } = useAuth();

  const [form, setForm] = useState({
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser?.token) {
      setError("Session expired. Please login again.");
      return;
    }

    if (!form.subject.trim()) {
      setError("Please enter a subject.");
      return;
    }

    if (!form.message.trim()) {
      setError("Please describe your issue.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await fetch(
        `${API_URL}/api/support/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUser.token}`,
          },
          body: JSON.stringify({
            subject: form.subject,
            message: form.message,
          }),
        }
      );

      let data = {};

      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Failed to send support request."
        );
      }

      setSuccess(
        "Your support request has been sent successfully."
      );

      setForm({
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to send support request."
      );
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "Go to Forgot Password from the login page and enter your registered email. You can also change your password from Security settings when you are logged in.",
    },
    {
      question: "How do I delete my account?",
      answer:
        'Go to Account Settings → Security → Danger Zone and select "Delete Account". This action cannot be undone.',
    },
    {
      question: "How do I update my profile?",
      answer:
        "Go to Account Settings from the settings menu. You can update your name, phone number and profile image there.",
    },
    {
      question: "How do I change my password?",
      answer:
        "Open Security from the settings menu, enter your current password and your new password, then click Update Password.",
    },
    {
      question: "How long does support take?",
      answer:
        "Support requests are generally reviewed within 24–48 hours.",
    },
  ];

  const quickHelp = [
    "Account Issues",
    "Payment Problems",
    "Report Bug",
    "Feature Request",
  ];

  const handleQuickHelp = (topic) => {
    setForm((prev) => ({
      ...prev,
      subject: topic,
    }));

    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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

      <div className="relative max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* ================= CONTACT SUPPORT ================= */}

        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Contact Support
            </h2>

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Tell us what went wrong and we'll take a look.
            </p>

          </div>

          {/* Success */}

          {success && (
            <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle size={15} />
              {success}
            </div>
          )}

          {/* Error */}

          {error && (
            <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-xs font-semibold">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="space-y-5">

              {/* Subject */}

              <div>

                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Subject
                </label>

                <div className="flex items-center gap-3 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-700/40 focus-within:border-indigo-500 transition">

                  <Mail
                    size={16}
                    className="text-slate-400"
                  />

                  <input
                    type="text"
                    name="subject"
                    placeholder="What do you need help with?"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  />

                </div>

              </div>

              {/* Message */}

              <div>

                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Message
                </label>

                <div className="flex items-start gap-3 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-700/40 focus-within:border-indigo-500 transition">

                  <MessageCircleQuestion
                    size={16}
                    className="text-slate-400 mt-1"
                  />

                  <textarea
                    name="message"
                    placeholder="Describe your issue..."
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-transparent outline-none resize-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  />

                </div>

              </div>

            </div>

            {/* Send */}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-md shadow-indigo-500/20"
            >

              <Send size={14} />

              {loading
                ? "Sending..."
                : "Send Message"}

            </button>

          </form>

        </div>

        {/* ================= FAQ ================= */}

        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm">

          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-2">

            {faqs.map((faq, index) => {
              const isOpen =
                openFaq === index;

              return (
                <div
                  key={index}
                  className="border border-slate-100 dark:border-slate-700/60 rounded-xl overflow-hidden"
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(
                        isOpen
                          ? null
                          : index
                      )
                    }
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/30 transition"
                  >

                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform ${
                        isOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />

                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4">

                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {faq.answer}
                      </p>

                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </div>

        {/* ================= QUICK HELP ================= */}

        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm">

          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Quick Help
          </h2>

          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
            Select a topic to quickly fill the support subject.
          </p>

          <div className="flex flex-wrap gap-3">

            {quickHelp.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() =>
                  handleQuickHelp(topic)
                }
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 transition"
              >
                {topic}
              </button>
            ))}

          </div>

        </div>

        <Footer />

      </div>

    </div>
  );
};

export default HelpNSupport;