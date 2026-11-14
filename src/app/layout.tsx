import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "宠物饮食安全指南 | Pet Food Safety Guide",
  description:
    "查询常见宠物（小狗、猫咪、仓鼠、兔子、鹦鹉、乌龟）的饮食安全知识，了解哪些食物安全、哪些需要谨慎、哪些绝对禁止。",
  keywords: [
    "宠物饮食",
    "宠物食物安全",
    "狗狗不能吃什么",
    "猫咪饮食",
    "宠物禁忌食物",
    "Pet Food Safety",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <div className="flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
