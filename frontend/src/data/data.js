import {
  ShoppingCart,
  Coffee,
  Car,
  Home,
  Zap,
  MoreHorizontal,
} from "lucide-react";

const CATEGORIES = [
  {
    id: "housing",
    label: "Housing",
    icon: Home,
    color: "#6366f1",
  },
  {
    id: "food",
    label: "Food",
    icon: Coffee,
    color: "#f59e0b",
  },
  {
    id: "transport",
    label: "Transport",
    icon: Car,
    color: "#10b981",
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: ShoppingCart,
    color: "#ec4899",
  },
  {
    id: "utilities",
    label: "Utilities",
    icon: Zap,
    color: "#3b82f6",
  },
  {
    id: "other",
    label: "Other",
    icon: MoreHorizontal,
    color: "#8b5cf6",
  },
];

export { CATEGORIES };