import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { fmt, fmtFull } from "../utils/format";

import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  DollarSign,
} from "lucide-react";

import MetricCard from "../components/MetricCard";
import TransactionRow from "../components/TransactionRow";
import CategoryBreakdown from "../components/CategoryBreakdown";
import BarChart from "../components/BarChart";
import AddExpenseForm from "../components/AddExpenseForm";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useAuth } from "../context/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8081";

function Dashboard() {
  const { isDark } = useTheme();
  const { user: authUser } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // MONTHLY GRAPH RANGE
  // =========================

  const [chartRange, setChartRange] = useState("7");

  // =========================
  // FETCH TRANSACTIONS
  // =========================

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!authUser?.token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${API_URL}/api/expenses`,
          {
            headers: {
              Authorization: `Bearer ${authUser.token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await res.json();

        setTransactions(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(err);

        setError(
          "Failed to load transactions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [authUser?.token]);

  // =========================
  // ADD TRANSACTION
  // =========================

  const addTransaction = async (tx) => {
    if (!authUser?.token) {
      setError(
        "Session expired. Please login again."
      );
      return;
    }

    try {
      setError("");

      const res = await fetch(
        `${API_URL}/api/expenses`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUser.token}`,
          },

          body: JSON.stringify({
            description: tx.description,
            amount: tx.amount,
            category: tx.category,
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
            "Failed to add transaction"
        );
      }

      setTransactions((prev) => [
        data,
        ...prev,
      ]);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to add transaction."
      );
    }
  };

  // =========================
  // DELETE TRANSACTION
  // =========================

  const deleteTransaction = async (id) => {
    if (!authUser?.token) {
      setError(
        "Session expired. Please login again."
      );
      return;
    }

    try {
      setError("");

      const res = await fetch(
        `${API_URL}/api/expenses/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(
          "Failed to delete transaction"
        );
      }

      setTransactions((prev) =>
        prev.filter((t) => t.id !== id)
      );
    } catch (err) {
      console.error(err);

      setError(
        "Failed to delete transaction."
      );
    }
  };

  // =========================
  // CURRENT MONTH
  // =========================

  const now = new Date();

  const currentYear =
    now.getFullYear();

  const currentMonth =
    now.getMonth();

  const currentMonthTransactions =
    transactions.filter((tx) => {
      if (!tx.date) return false;

      const transactionDate =
        new Date(tx.date);

      return (
        transactionDate.getFullYear() ===
          currentYear &&
        transactionDate.getMonth() ===
          currentMonth
      );
    });

  // =========================
  // CURRENT MONTH METRICS
  // =========================

  const income =
    currentMonthTransactions
      .filter(
        (t) => Number(t.amount) > 0
      )
      .reduce(
        (sum, t) =>
          sum + Number(t.amount),
        0
      );

  const expenses =
    currentMonthTransactions
      .filter(
        (t) => Number(t.amount) < 0
      )
      .reduce(
        (sum, t) =>
          sum +
          Math.abs(Number(t.amount)),
        0
      );

  const balance =
    income - expenses;

  const savingsRate =
    income > 0
      ? ((income - expenses) /
          income) *
        100
      : 0;

  const expenseCount =
    currentMonthTransactions.filter(
      (t) => Number(t.amount) < 0
    ).length;

  // =========================
  // MONTHLY GRAPH DATA
  // =========================

  const monthlyData = (() => {
    const months = [];

    let numberOfMonths = 7;

    if (chartRange === "6") {
      numberOfMonths = 6;
    }

    if (chartRange === "12") {
      numberOfMonths = 12;
    }

    // This Year
    if (chartRange === "year") {
      numberOfMonths =
        currentMonth + 1;
    }

    let startIndex;

    if (chartRange === "year") {
      startIndex = 0;
    } else {
      startIndex =
        numberOfMonths - 1;
    }

    for (
      let i = startIndex;
      i >= 0;
      i--
    ) {
      let date;

      if (chartRange === "year") {
        date = new Date(
          currentYear,
          i,
          1
        );
      } else {
        date = new Date(
          currentYear,
          currentMonth - i,
          1
        );
      }

      months.push({
        month:
          date.toLocaleString(
            "en-US",
            {
              month: "short",
            }
          ),

        year: date.getFullYear(),

        monthIndex:
          date.getMonth(),

        spend: 0,
      });
    }

    transactions.forEach((tx) => {
      if (Number(tx.amount) >= 0) {
        return;
      }

      if (!tx.date) {
        return;
      }

      const transactionDate =
        new Date(tx.date);

      const matchingMonth =
        months.find(
          (m) =>
            m.year ===
              transactionDate.getFullYear() &&
            m.monthIndex ===
              transactionDate.getMonth()
        );

      if (matchingMonth) {
        matchingMonth.spend +=
          Math.abs(
            Number(tx.amount)
          );
      }
    });

    return months;
  })();

  // =========================
  // GRAPH RANGE LABEL
  // =========================

  const chartRangeLabel =
    chartRange === "7"
      ? "Last 7 months"
      : chartRange === "6"
        ? "Last 6 months"
        : chartRange === "12"
          ? "Last 12 months"
          : "This year";

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
          Loading dashboard...
        </p>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-slate-900"
          : "bg-slate-50"
      }`}
    >
      {/* GRID BACKGROUND */}

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(
              ${isDark ? "#ffffff" : "#000000"} 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              ${isDark ? "#ffffff" : "#000000"} 1px,
              transparent 1px
            )
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <Header />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

        {/* ERROR */}

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        {/* =========================
            METRIC CARDS
        ========================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <MetricCard
            label="Balance"
            value={fmtFull(balance)}
            sub="This month"
            positive={balance >= 0}
            icon={CreditCard}
            accent="#6366f1"
          />

          <MetricCard
            label="Income"
            value={fmt(income)}
            sub="This month"
            positive={true}
            icon={TrendingUp}
            accent="#10b981"
          />

          <MetricCard
            label="Expenses"
            value={fmt(expenses)}
            sub="This month"
            positive={false}
            icon={TrendingDown}
            accent="#f43f5e"
          />

          <MetricCard
            label="Transactions"
            value={
              currentMonthTransactions.length
            }
            sub={`${expenseCount} expenses`}
            positive={true}
            icon={DollarSign}
            accent="#f59e0b"
          />

        </div>

        {/* =========================
            MAIN GRID
        ========================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}

          <div className="lg:col-span-2 space-y-6">

            {/* =========================
                MONTHLY SPEND
            ========================= */}

            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                <div>

                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Monthly Spend
                  </h2>

                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {chartRangeLabel}
                  </p>

                </div>

                <div className="flex items-center gap-4">

                  {/* CURRENT MONTH TOTAL */}

                  <div className="text-right">

                    <div className="text-lg font-black text-indigo-500 tabular-nums">

                      {fmt(
                        monthlyData[
                          monthlyData.length -
                            1
                        ]?.spend || 0
                      )}

                    </div>

                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      Current
                    </div>

                  </div>

                  {/* RANGE SELECTOR */}

                  <select
                    value={chartRange}
                    onChange={(e) =>
                      setChartRange(
                        e.target.value
                      )
                    }
                    className="text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                  >

                    <option value="7">
                      Last 7 Months
                    </option>

                    <option value="6">
                      Last 6 Months
                    </option>

                    <option value="12">
                      Last 12 Months
                    </option>

                    <option value="year">
                      This Year
                    </option>

                  </select>

                </div>

              </div>

              <BarChart
                data={monthlyData}
                isDark={isDark}
              />

            </div>

            {/* =========================
                CATEGORY BREAKDOWN
            ========================= */}

            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm">

              <div className="flex items-center justify-between mb-5">

                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Spending by Category
                </h2>

                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {fmt(expenses)} total
                </span>

              </div>

              <CategoryBreakdown
                transactions={
                  currentMonthTransactions
                }
              />

            </div>

          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            {/* ADD TRANSACTION */}

            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm">

              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                Add Transaction
              </h2>

              <AddExpenseForm
                onAdd={addTransaction}
              />

            </div>

            {/* RECENT */}

            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm">

              <div className="flex items-center justify-between mb-2">

                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recent
                </h2>

                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {transactions.length} entries
                </span>

              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-80 overflow-y-auto -mx-1">

                {transactions.length === 0 ? (

                  <div className="py-8 text-center">

                    <p className="text-sm text-slate-400 dark:text-slate-500">
                      No transactions yet.
                    </p>

                    <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                      Add your first transaction above.
                    </p>

                  </div>

                ) : (

                  transactions
                    .slice(0, 10)
                    .map((tx) => (
                      <TransactionRow
                        key={tx.id}
                        tx={tx}
                        onDelete={
                          deleteTransaction
                        }
                      />
                    ))

                )}

              </div>

            </div>

          </div>

        </div>

        <Footer />

      </div>

    </div>
  );
}

export default Dashboard;