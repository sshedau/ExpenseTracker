import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { INITIAL_TRANSACTIONS, MONTHLY_DATA } from "../data/data";
import {fmt, fmtFull} from "../utils/format"
import {
  Sun, Moon, Monitor, TrendingUp, TrendingDown,
  Wallet, CreditCard, DollarSign
} from "lucide-react";
import MetricCard from "../components/MetricCard";
import TransactionRow from "../components/TransactionRow";
import CategoryBreakdown from "../components/CategoryBreakdown";
import BarChart from "../components/BarChart";
import AddExpenseForm from "../components/AddExpenseForm";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

function Dashboard() {
  const { isDark, toggle, override, systemTheme } = useTheme();
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  const income = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  const addTransaction = (tx) => setTransactions((prev) => [tx, ...prev]);
  const deleteTransaction = (id) => setTransactions((prev) => prev.filter((t) => t.id !== id));

  const isOverriding = override !== null;
  const ThemeIcon = isOverriding ? (isDark ? Moon : Sun) : Monitor;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(${isDark ? "#ffffff" : "#000000"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "#ffffff" : "#000000"} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <Header />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Header */}
        

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Balance"
            value={fmtFull(balance)}
            sub={`${savingsRate.toFixed(1)}% savings rate`}
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
            value={transactions.length}
            sub={`${transactions.filter(t => t.amount < 0).length} expenses`}
            positive={true}
            icon={DollarSign}
            accent="#f59e0b"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column: Chart + Breakdown */}
          <div className="lg:col-span-2 space-y-6">

            {/* Bar Chart Card */}
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Spend</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Last 7 months</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-indigo-500 tabular-nums">
                    {fmt(MONTHLY_DATA[MONTHLY_DATA.length - 1].spend)}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Current</div>
                </div>
              </div>
              <BarChart data={MONTHLY_DATA} isDark={isDark} />
            </div>

            {/* Category Breakdown */}
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Spending by Category</h2>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{fmt(expenses)} total</span>
              </div>
              <CategoryBreakdown transactions={transactions} />
            </div>
          </div>

          {/* Right column: Add form + Transactions */}
          <div className="space-y-6">

            {/* Add Form */}
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Add Transaction</h2>
              <AddExpenseForm onAdd={addTransaction} />
            </div>

            {/* Recent Transactions */}
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent</h2>
                <span className="text-xs text-slate-400 dark:text-slate-500">{transactions.length} entries</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-80 overflow-y-auto -mx-1">
                {transactions.slice(0, 10).map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} onDelete={deleteTransaction} />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <Footer/>

      </div>
    </div>
  );
}

export default Dashboard;

