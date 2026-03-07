import {
  ShoppingCart, Coffee, Car, Home, Zap, MoreHorizontal
} from "lucide-react";

const CATEGORIES = [
  { id: "housing",  label: "Housing",   icon: Home,         color: "#6366f1" },
  { id: "food",     label: "Food",      icon: Coffee,       color: "#f59e0b" },
  { id: "transport",label: "Transport", icon: Car,          color: "#10b981" },
  { id: "shopping", label: "Shopping",  icon: ShoppingCart, color: "#ec4899" },
  { id: "utilities",label: "Utilities", icon: Zap,          color: "#3b82f6" },
  { id: "other",    label: "Other",     icon: MoreHorizontal,color: "#8b5cf6" },
];

const INITIAL_TRANSACTIONS = [
  { id: 1, description: "Monthly Rent",       amount: -1800, category: "housing",   date: "2026-03-01" },
  { id: 2, description: "Grocery Run",        amount: -142,  category: "food",      date: "2026-03-03" },
  { id: 3, description: "Salary Deposit",     amount: 4500,  category: "other",     date: "2026-03-05" },
  { id: 4, description: "Uber to Airport",    amount: -38,   category: "transport", date: "2026-03-06" },
  { id: 5, description: "Coffee Subscription",amount: -19,   category: "food",      date: "2026-03-07" },
  { id: 6, description: "Electric Bill",      amount: -87,   category: "utilities", date: "2026-03-07" },
  { id: 7, description: "Amazon Order",       amount: -225,  category: "shopping",  date: "2026-03-06" },
  { id: 8, description: "Freelance Payment",  amount: 950,   category: "other",     date: "2026-03-04" },
];

const MONTHLY_DATA = [
  { month: "Sep", spend: 3100 },
  { month: "Oct", spend: 2750 },
  { month: "Nov", spend: 3480 },
  { month: "Dec", spend: 4200 },
  { month: "Jan", spend: 3050 },
  { month: "Feb", spend: 2890 },
  { month: "Mar", spend: 2311 },
];

export { CATEGORIES, INITIAL_TRANSACTIONS, MONTHLY_DATA };