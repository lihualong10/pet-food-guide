import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { SafetyLevel } from "@/data/petFoods";
import { SAFETY_LABEL } from "@/data/petFoods";

const config: Record<
  SafetyLevel,
  {
    icon: typeof CheckCircle2;
    bg: string;
    text: string;
    border: string;
    dot: string;
    label: string;
  }
> = {
  safe: {
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    label: SAFETY_LABEL.safe,
  },
  caution: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    label: SAFETY_LABEL.caution,
  },
  forbidden: {
    icon: XCircle,
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
    label: SAFETY_LABEL.forbidden,
  },
};

interface SafetyBadgeProps {
  safety: SafetyLevel;
  variant?: "badge" | "pill";
}

export default function SafetyBadge({
  safety,
  variant = "badge",
}: SafetyBadgeProps) {
  const c = config[safety];
  const Icon = c.icon;

  if (variant === "pill") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${c.bg} ${c.text}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
        {c.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${c.bg} ${c.text} ${c.border}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {c.label}
    </span>
  );
}
