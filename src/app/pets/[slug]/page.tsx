import { pets } from "@/data/petFoods";
import PetDetailClient from "./PetDetailClient";

// 静态导出需要为动态路由预生成所有 slug
export function generateStaticParams() {
  return pets.map((pet) => ({ slug: pet.slug }));
}

// 静态导出时不允许动态参数
export const dynamicParams = false;

export default function PetDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <PetDetailClient slug={params.slug} />;
}
