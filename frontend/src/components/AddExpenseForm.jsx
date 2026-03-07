import { useState } from "react";
import { CATEGORIES } from "../data/data";
import {
  Plus
} from "lucide-react";

function AddExpenseForm({ onAdd }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [type, setType] = useState("expense");

  const handleSubmit = () => {
    if (!desc.trim() || !amount || isNaN(parseFloat(amount))) return;
    const val = parseFloat(amount);
    onAdd({
      id: Date.now(),
      description: desc.trim(),
      amount: type === "expense" ? -Math.abs(val) : Math.abs(val),
      category,
      date: new Date().toISOString().slice(0, 10),
    });
    setDesc(""); setAmount("");
  };

  const inputBase = "w-full rounded-xl border bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-sm font-medium px-3 py-2.5 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 border-slate-200 dark:border-slate-600 placeholder:text-slate-400 dark:placeholder:text-slate-500";

  return (
    <div className="space-y-3">
      {/* Type toggle */}
      <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 p-1 gap-1 bg-slate-100 dark:bg-slate-700/50">
        {["expense", "income"].map((t) => (
          <button key={t}
            onClick={() => setType(t)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold tracking-wide capitalize transition-all duration-200 ${
              type === t
                ? t === "expense"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-emerald-500 text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}>
            {t}
          </button>
        ))}
      </div>

      <input
        className={inputBase}
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <div className="flex gap-2">
        <input
          className={inputBase}
          placeholder="0.00"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          className={`${inputBase} flex-shrink-0 w-auto`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-bold transition-all duration-150 shadow-sm shadow-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/40"
      >
        <Plus size={15} />
        Add Transaction
      </button>
    </div>
  );
}

export default AddExpenseForm;