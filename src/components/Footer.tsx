import { ShieldAlert, Stethoscope } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-amber-600">
            <ShieldAlert className="h-5 w-5" />
            <span className="text-sm font-semibold">免责声明</span>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
            食物安全数据参考 <span className="font-medium text-slate-600">ASPCA</span> 及公开兽医营养资料整理，仅供日常参考，不能替代专业兽医诊断。如宠物误食危险食物或出现异常症状，请立即联系专业兽医。
          </p>
          <div className="mt-1 flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
            <Stethoscope className="h-3.5 w-3.5" />
            紧急情况请立即就医
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} 宠物饮食安全指南 · Pet Food Safety Guide
          </p>
        </div>
      </div>
    </footer>
  );
}
