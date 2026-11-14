import { Info, AlertOctagon } from "lucide-react";
import type { FoodItem } from "@/data/petFoods";
import SafetyBadge from "./SafetyBadge";

const ringColor: Record<FoodItem["safety"], string> = {
  safe: "hover:border-emerald-300",
  caution: "hover:border-amber-300",
  forbidden: "hover:border-rose-300",
};

export default function FoodCard({ food }: { food: FoodItem }) {
  const isDanger = food.safety === "forbidden";

  return (
    <div
      className={`card-hover group flex flex-col rounded-2xl border bg-white p-5 shadow-sm ${ringColor[food.safety]} ${
        isDanger ? "border-rose-200" : "border-slate-200"
      }`}
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

      {/* 危险食物紧急提示条 */}
      {isDanger && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5">
          <AlertOctagon className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-500" />
          <p className="text-xs leading-relaxed text-rose-700">
            <span className="font-bold">紧急提示：</span>
            若已误食，请立即记录误食时间与克数，<span className="font-semibold">切勿盲目自行催吐</span>，尽快联系兽医！
          </p>
        </div>
      )}

      {food.note && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2">
          <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          <p className="text-xs leading-relaxed text-slate-500">{food.note}</p>
        </div>
      )}
    </div>
  );
}
