import { Info } from "lucide-react";
import type { FoodItem } from "@/data/petFoods";
import SafetyBadge from "./SafetyBadge";

const ringColor: Record<FoodItem["safety"], string> = {
  safe: "hover:border-emerald-300",
  caution: "hover:border-amber-300",
  forbidden: "hover:border-rose-300",
};

export default function FoodCard({ food }: { food: FoodItem }) {
  return (
    <div
      className={`card-hover group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${ringColor[food.safety]}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 text-2xl shadow-inner ring-1 ring-slate-100">
            {food.emoji}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-slate-800">
              {food.name}
            </h3>
            {food.nameEn && (
              <p className="mt-0.5 truncate text-sm text-slate-400">
                {food.nameEn}
              </p>
            )}
          </div>
        </div>
        <SafetyBadge safety={food.safety} />
      </div>

      <p className="flex-1 text-sm leading-relaxed text-slate-600">
        {food.reason}
      </p>

      {food.note && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2">
          <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          <p className="text-xs leading-relaxed text-slate-500">{food.note}</p>
        </div>
      )}
    </div>
  );
}
