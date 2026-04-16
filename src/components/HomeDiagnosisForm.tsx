"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const INDUSTRIES = ["飲食業", "製造業", "小売業", "サービス業", "建設業", "IT・通信業", "美容・エステ", "その他"];

const PURPOSES = [
  "新規事業・業態転換",
  "設備投資・機械導入",
  "ITツール・DX化",
  "店舗改装・リニューアル",
  "EC・ネット販売開始",
  "その他",
];

export function HomeDiagnosisForm() {
  const router = useRouter();
  const [industry, setIndustry] = useState("");
  const [purpose, setPurpose] = useState("");

  const canSubmit = industry && purpose;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const params = new URLSearchParams({ industry, purpose });
    router.push(`/diagnosis?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 space-y-8 border-t-4 border-[#c8102e]">
      {/* STEP 01 */}
      <div>
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
          <span className="bg-[#0a1f3d] text-white text-xs font-black px-3 py-1 tracking-widest">STEP 01</span>
          <h3 className="font-[family-name:var(--font-noto-serif-jp)] font-black text-[#0a1f3d] text-lg">
            業種を選択してください
          </h3>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {INDUSTRIES.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setIndustry(t)}
              className={`py-3 border-2 font-bold text-sm transition-all ${
                industry === t
                  ? "border-[#c8102e] bg-[#c8102e] text-white"
                  : "border-gray-300 bg-white hover:border-[#0a1f3d] text-[#0a1f3d]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 02 */}
      <div>
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
          <span className="bg-[#0a1f3d] text-white text-xs font-black px-3 py-1 tracking-widest">STEP 02</span>
          <h3 className="font-[family-name:var(--font-noto-serif-jp)] font-black text-[#0a1f3d] text-lg">
            補助金の使用目的を選択
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PURPOSES.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setPurpose(p)}
              className={`py-3 border-2 font-bold text-sm transition-all ${
                purpose === p
                  ? "border-[#c8102e] bg-[#c8102e] text-white"
                  : "border-gray-300 bg-white hover:border-[#0a1f3d] text-[#0a1f3d]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full font-black text-lg md:text-xl py-5 transition-all ${
            canSubmit
              ? "bg-[#c8102e] hover:bg-[#a50d24] text-white cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          今すぐ無料でAI補助金診断する ▶
        </button>
        <p className="text-center text-xs text-gray-500 mt-4">
          採択実績 <span className="font-bold text-[#c8102e]">200件</span> のデータを活用
        </p>
      </div>
    </form>
  );
}
