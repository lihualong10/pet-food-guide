"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  UtensilsCrossed,
  ChevronDown,
  ChevronUp,
  PawPrint,
} from "lucide-react";
import { pets } from "@/data/petFoods";
import type { Pet, FoodItem } from "@/data/petFoods";
import SafetyBadge from "@/components/SafetyBadge";
import Footer from "@/components/Footer";

const DEFAULT_VISIBLE_COUNT = 8;

// 跨宠物食物搜索结果项
interface CrossPetResult {
  pet: Pet;
  food: FoodItem;
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [foodQuery, setFoodQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filteredPets = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pets;
    return pets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(q) ||
        pet.nameEn.toLowerCase().includes(q) ||
        pet.slug.toLowerCase().includes(q)
    );
  }, [query]);

  // 跨宠物食物搜索：遍历所有宠物的食物列表，匹配食物名/英文名/别名
  const crossPetResults = useMemo<CrossPetResult[]>(() => {
    const q = foodQuery.trim().toLowerCase();
    if (!q) return [];
    const results: CrossPetResult[] = [];
    for (const pet of pets) {
      for (const food of pet.foods) {
        const aliasMatch =
          food.aliases?.some((a) => a.toLowerCase().includes(q)) ?? false;
        if (
          food.name.toLowerCase().includes(q) ||
          (food.nameEn?.toLowerCase().includes(q) ?? false) ||
          aliasMatch ||
          food.reason.toLowerCase().includes(q)
        ) {
          results.push({ pet, food });
        }
      }
    }
    return results;
  }, [foodQuery]);

  const isSearching = query.trim().length > 0;
  const isFoodSearching = foodQuery.trim().length > 0;

  // 搜索时显示全部匹配结果；否则默认只展示前 8 个，展开后显示全部
  const displayedPets = useMemo(() => {
    if (isSearching || expanded) return filteredPets;
    return filteredPets.slice(0, DEFAULT_VISIBLE_COUNT);
  }, [filteredPets, isSearching, expanded]);

  const hasMore = filteredPets.length > DEFAULT_VISIBLE_COUNT;

  return (
    <>
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600">
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
          <div className="absolute -left-10 top-6 text-[100px]">🐾</div>
          <div className="absolute right-8 top-12 text-[80px]">🐶</div>
          <div className="absolute bottom-0 left-1/3 text-[70px]">🐱</div>
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              <UtensilsCrossed className="h-4 w-4" />
              科学喂养 · 守护毛孩子健康
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              宠物饮食安全指南
            </h1>
            <p className="mt-3 text-sm text-emerald-50 sm:text-base">
              快速查询常见宠物的食物安全等级，让每一口都吃得安心
            </p>
          </div>
        </div>
        <div className="h-6 bg-gradient-to-b from-transparent to-slate-100" />
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* 跨宠物食物搜索（主搜索框） */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-slate-700">
            <PawPrint className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-bold">跨宠物食物安全查询</h2>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={foodQuery}
              onChange={(e) => setFoodQuery(e.target.value)}
              placeholder="输入食物名称，如：苹果、巧克力、牛奶…一键查看各宠物安全等级"
              className="search-input w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-4 text-base text-slate-700 shadow-lg placeholder:text-slate-400 ring-1 ring-slate-200"
            />
            {foodQuery && (
              <button
                onClick={() => setFoodQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500 hover:bg-slate-200"
              >
                清除
              </button>
            )}
          </div>

          {/* 跨宠物搜索结果 */}
          {isFoodSearching && (
            <div className="mt-4">
              <p className="mb-3 text-sm text-slate-500">
                「<span className="font-semibold text-slate-700">{foodQuery}</span>
                」共在{" "}
                <span className="font-semibold text-slate-700">
                  {crossPetResults.length}
                </span>{" "}
                个宠物条目中命中：
              </p>

              {crossPetResults.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
                  <div className="text-4xl">🤔</div>
                  <p className="mt-3 text-slate-500">
                    暂未收录该食物，建议咨询兽医确认安全性
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {crossPetResults.map(({ pet, food }) => (
                    <Link
                      key={`${pet.slug}-${food.name}`}
                      href={`/pets/${pet.slug}`}
                      className="card-hover flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md"
                    >
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-xl"
                        style={{ backgroundColor: `${pet.accent}22` }}
                      >
                        {pet.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {pet.name}
                          </p>
                          <SafetyBadge safety={food.safety} />
                        </div>
                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {food.name}
                          {food.nameEn ? ` · ${food.nameEn}` : ""}
                        </p>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                          {food.reason}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* 宠物分类卡片网格 */}
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">选择你的宠物</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              点击卡片查看该宠物的详细饮食安全清单
            </p>
          </div>
          <span className="text-sm text-slate-400">
            共 {pets.length} 种宠物
          </span>
        </div>

        {/* 宠物名称快速搜索 */}
        <div className="mb-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索宠物名称，如：小狗、猫咪、仓鼠..."
              className="search-input w-full rounded-xl border-0 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200 placeholder:text-slate-400"
            />
          </div>
        </div>

        {filteredPets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-4 text-slate-500">
              暂未找到名为「{query}」的宠物
            </p>
            <button
              onClick={() => setQuery("")}
              className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
            >
              查看全部宠物
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-3">
              {displayedPets.map((pet) => (
                <Link
                  key={pet.slug}
                  href={`/pets/${pet.slug}`}
                  className="card-hover group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div
                    className="absolute right-0 top-0 h-16 w-16 rounded-bl-full opacity-20 transition-opacity group-hover:opacity-30"
                    style={{ backgroundColor: pet.accent }}
                  />
                  <div className="relative flex flex-col items-center gap-1.5">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl shadow-inner"
                      style={{ backgroundColor: `${pet.accent}22` }}
                    >
                      {pet.emoji}
                    </div>
                    <h3 className="text-center text-sm font-bold leading-tight text-slate-800">
                      {pet.name}
                    </h3>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${pet.accent}1a`,
                        color: pet.accent,
                      }}
                    >
                      {pet.foods.length}种
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* 展开 / 收起按钮（仅在非搜索状态且有更多宠物时显示） */}
            {!isSearching && hasMore && (
              <div className="mt-5 flex justify-center">
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-emerald-300 hover:text-emerald-600"
                >
                  {expanded ? (
                    <>
                      收起
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      展开全部宠物
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
