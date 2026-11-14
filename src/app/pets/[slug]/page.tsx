"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUp, Search, Stethoscope, Filter } from "lucide-react";
import { getPetBySlug } from "@/data/petFoods";
import type { SafetyLevel } from "@/data/petFoods";
import FoodCard from "@/components/FoodCard";
import Footer from "@/components/Footer";

type FilterKey = "all" | SafetyLevel;

const FILTERS: { key: FilterKey; label: string; color: string }[] = [
  { key: "all", label: "全部", color: "text-slate-700" },
  {
    key: "safe",
    label: "✅ 适合吃（安全）",
    color: "text-emerald-700",
  },
  {
    key: "caution",
    label: "⚠️ 少量 / 谨慎食用",
    color: "text-amber-700",
  },
  {
    key: "forbidden",
    label: "❌ 绝对禁止（有毒 / 危险）",
    color: "text-rose-700",
  },
];

const ACTIVE_STYLES: Record<FilterKey, string> = {
  all: "bg-slate-800 text-white border-slate-800",
  safe: "bg-emerald-500 text-white border-emerald-500",
  caution: "bg-amber-500 text-white border-amber-500",
  forbidden: "bg-rose-500 text-white border-rose-500",
};

export default function PetDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const pet = getPetBySlug(params.slug);
  if (!pet) {
    notFound();
  }

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [showTopBtn, setShowTopBtn] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 监听页面滚动，超过 300px 时显示"回到顶部搜索"按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 点击悬浮按钮：平滑滚动到顶部后自动聚焦搜索框
  const handleScrollToSearch = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // 等待平滑滚动动画完成后聚焦搜索框
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 500);
  };

  // 仅按搜索关键词过滤（不涉及安全状态），用于计算各标签的动态数字
  const searchMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pet.foods;
    return pet.foods.filter((food) => {
      const aliasMatch = food.aliases?.some((a) =>
        a.toLowerCase().includes(q)
      ) ?? false;
      return (
        food.name.toLowerCase().includes(q) ||
        (food.nameEn?.toLowerCase().includes(q) ?? false) ||
        aliasMatch ||
        food.reason.toLowerCase().includes(q)
      );
    });
  }, [pet, query]);

  // 基于搜索结果的安全状态计数（随搜索关键词实时变化）
  const counts = useMemo(() => {
    const c = { safe: 0, caution: 0, forbidden: 0 };
    searchMatches.forEach((f) => {
      c[f.safety]++;
    });
    return c;
  }, [searchMatches]);

  // 最终展示列表：搜索结果 + 安全状态筛选
  const filteredFoods = useMemo(() => {
    if (filter === "all") return searchMatches;
    return searchMatches.filter((food) => food.safety === filter);
  }, [searchMatches, filter]);

  return (
    <>
      {/* 顶部栏 */}
      <header
        className="relative overflow-hidden text-white"
        style={{
          background: `linear-gradient(135deg, ${pet.accent} 0%, ${pet.accent}cc 100%)`,
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/30"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div
              className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-white/20 text-5xl backdrop-blur"
            >
              {pet.emoji}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl">
                {pet.name}
                <span className="ml-3 text-xl font-normal text-white/80">
                  {pet.nameEn}
                </span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
                {pet.description}
              </p>
            </div>
          </div>

          {/* 分类内食物搜索框 */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索食物名称，如：巧克力、苹果、牛奶..."
                className="search-input w-full rounded-2xl border-0 bg-white py-3.5 pl-12 pr-4 text-base text-slate-700 shadow-lg placeholder:text-slate-400"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-200"
                >
                  清除
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 主体 */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* 状态筛选标签 */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
            <Filter className="h-4 w-4" />
            <span>按安全状态筛选</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const isActive = filter === f.key;
              const count =
                f.key === "all"
                  ? searchMatches.length
                  : counts[f.key as SafetyLevel];
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? ACTIVE_STYLES[f.key]
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {f.label}
                  <span
                    className={`ml-0.5 rounded-full px-1.5 py-0.5 text-xs ${
                      isActive
                        ? "bg-white/25"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 结果统计 */}
        <div className="mb-4 text-sm text-slate-500">
          共 <span className="font-semibold text-slate-700">{filteredFoods.length}</span> 条结果
          {query && (
            <span>
              ，关键词「<span className="text-slate-700">{query}</span>」
            </span>
          )}
        </div>

        {/* 食物卡片列表 / 空状态 */}
        {filteredFoods.length === 0 ? (
          <div className="animate-fade-in-up rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <div className="text-5xl">🤔</div>
            <p className="mt-4 text-lg font-semibold text-slate-700">
              暂未收录该食物
            </p>
            <p className="mt-2 text-sm text-slate-500">
              建议咨询兽医确认安全性，切勿随意喂食
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-sky-50 px-4 py-2 text-sm text-sky-700">
              <Stethoscope className="h-4 w-4" />
              有疑问请及时咨询专业兽医
            </div>
            <div className="mt-6 flex justify-center gap-3">
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                  清除搜索
                </button>
              )}
              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  查看全部状态
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFoods.map((food, idx) => (
              <div
                key={food.name}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(idx, 12) * 30}ms` }}
              >
                <FoodCard food={food} />
              </div>
            ))}
          </div>
        )}

        {/* 底部安全提示 */}
        {filteredFoods.length > 0 && (
          <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="text-sm leading-relaxed text-amber-800">
                <p className="font-semibold">温馨提示</p>
                <p className="mt-1">
                  即使标注为「安全」的食物，也应适量喂食并观察宠物反应。每只宠物的体质和过敏情况不同，首次喂食新食物请从极小量开始。如出现呕吐、腹泻、精神不振等异常，请立即停止喂食并咨询兽医。
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* 悬浮：回到顶部并搜索 */}
      <button
        onClick={handleScrollToSearch}
        aria-label="回到顶部搜索"
        title="回到顶部搜索"
        className={`group fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg shadow-slate-900/30 transition-all duration-300 hover:scale-110 hover:bg-slate-700 ${
          showTopBtn
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
        {/* 悬停提示文字 */}
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
          回到顶部搜索
        </span>
      </button>
    </>
  );
}
