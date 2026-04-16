"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { siteConfig } from "../../../site.config";

const INDUSTRIES = [
  "飲食業", "製造業", "小売業", "サービス業", "建設業",
  "IT・通信業", "医療・福祉", "美容・エステ", "教育", "その他",
];

const PURPOSES = [
  "新規事業・業態転換",
  "設備投資・機械導入",
  "ITツール・DX化",
  "店舗改装・リニューアル",
  "EC・ネット販売開始",
  "人材育成・研修",
  "海外展開",
  "省エネ・脱炭素",
];

const EMPLOYEE_COUNTS = ["1〜5名", "6〜20名", "21〜50名", "51〜100名", "101名以上"];
const REVENUE_RANGES = ["500万円未満", "500万〜1,000万円", "1,000万〜5,000万円", "5,000万〜1億円", "1億円以上"];

interface SubsidyResult {
  name: string;
  maxAmount: number;
  rate: string;
  probability: string;
  reason: string;
}

interface DiagnosisResult {
  subsidies: SubsidyResult[];
  totalPotential: number;
  factors: string[];
  recommendation: string;
}

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
  }
}

function DiagnosisContent() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [form, setForm] = useState({
    industry: "",
    employeeCount: "",
    annualRevenue: "",
    purpose: "",
    area: "",
  });

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return form.industry !== "";
      case 2: return form.employeeCount !== "";
      case 3: return form.annualRevenue !== "";
      case 4: return form.purpose !== "";
      case 5: return form.area !== "";
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setStep(6);

      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "generate_lead", {
          currency: "JPY",
          value: data.totalPotential * 10000,
          source: "ai_diagnosis",
        });
      }
    } catch {
      alert("診断中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 5;

  if (step === 6 && result) {
    return (
      <div className="min-h-screen bg-[#f5f2eb]">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <p className="text-[#c8102e] text-xs font-bold tracking-[0.3em] mb-2">── 診断結果 ──</p>
            <h1 className="font-[family-name:var(--font-noto-serif-jp)] text-2xl font-black text-[#0a1f3d]">
              AI補助金診断結果
            </h1>
            <p className="mt-2 text-gray-500 text-sm">
              {form.industry} / {form.employeeCount} / {form.annualRevenue}
            </p>
          </div>

          <div className="bg-white p-8 mb-6 border-t-4 border-[#c8102e]">
            <p className="text-center text-gray-500 text-sm mb-2">受給可能性のある補助金総額</p>
            <div className="text-center">
              <span className="font-[family-name:var(--font-noto-serif-jp)] text-5xl font-black text-[#c8102e]">
                {result.totalPotential.toLocaleString()}
              </span>
              <span className="text-2xl font-black text-[#c8102e] ml-1">万円</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {result.subsidies.map((s, i) => (
              <div key={i} className="bg-white p-6 border-l-4 border-[#0a1f3d]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-[#0a1f3d]">{s.name}</h3>
                  <span className={`text-xs font-bold px-3 py-1 ${
                    s.probability === "高" ? "bg-[#c8102e] text-white" :
                    s.probability === "中" ? "bg-[#c9a961] text-white" :
                    "bg-gray-300 text-gray-700"
                  }`}>
                    受給可能性: {s.probability}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{s.reason}</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-[#0a1f3d] font-bold">最大 {s.maxAmount.toLocaleString()}万円</span>
                  <span className="text-gray-500">補助率 {s.rate}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 mb-6">
            <h3 className="font-bold text-[#0a1f3d] mb-3">診断のポイント</h3>
            <ul className="space-y-2">
              {result.factors.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-5 h-5 bg-[#c8102e] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#0a1f3d] p-6 mb-6 text-sm text-gray-300">
            {result.recommendation}
          </div>

          <div className="bg-[#c8102e] p-8 text-center text-white">
            <h3 className="font-[family-name:var(--font-noto-serif-jp)] text-xl font-black">
              正式な補助金申請サポートをご希望ですか？
            </h3>
            <p className="mt-2 text-sm text-red-200">AI診断は概算です。専門家が詳細に診断します。</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="bg-white text-[#c8102e] font-bold px-8 py-3">
                無料で正式診断を依頼 ▶
              </Link>
              <a href={`tel:${siteConfig.cta.phone}`} className="border-2 border-white text-white font-bold px-8 py-3">
                電話で相談
              </a>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => { setStep(1); setResult(null); setForm({ industry: "", employeeCount: "", annualRevenue: "", purpose: "", area: "" }); }}
              className="text-[#c8102e] hover:underline text-sm"
            >
              もう一度診断する
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2eb]">
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <p className="text-[#c8102e] text-xs font-bold tracking-[0.3em] mb-3">── AI即時診断 ──</p>
          <h1 className="font-[family-name:var(--font-noto-serif-jp)] text-3xl font-black text-[#0a1f3d]">
            AI補助金診断
          </h1>
          <p className="mt-3 text-gray-500">5つの質問に答えるだけで、使える補助金と受給額がわかります</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>STEP {step} / {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 overflow-hidden">
            <div className="h-full bg-[#c8102e] transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white p-8 border-t-4 border-[#c8102e]">
          {step === 1 && (
            <div>
              <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-lg font-black text-[#0a1f3d] mb-6">業種を選択してください</h2>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRIES.map((t) => (
                  <button key={t} onClick={() => updateForm("industry", t)}
                    className={`py-4 border-2 font-bold text-sm transition-all ${form.industry === t ? "border-[#c8102e] bg-[#c8102e] text-white" : "border-gray-300 hover:border-[#0a1f3d] text-[#0a1f3d]"}`}
                  >{t}</button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-lg font-black text-[#0a1f3d] mb-6">従業員数を選択してください</h2>
              <div className="space-y-2">
                {EMPLOYEE_COUNTS.map((c) => (
                  <button key={c} onClick={() => updateForm("employeeCount", c)}
                    className={`w-full py-4 border-2 font-bold text-sm text-left px-4 transition-all ${form.employeeCount === c ? "border-[#c8102e] bg-[#c8102e] text-white" : "border-gray-300 hover:border-[#0a1f3d] text-[#0a1f3d]"}`}
                  >{c}</button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-lg font-black text-[#0a1f3d] mb-6">年間売上を選択してください</h2>
              <div className="space-y-2">
                {REVENUE_RANGES.map((r) => (
                  <button key={r} onClick={() => updateForm("annualRevenue", r)}
                    className={`w-full py-4 border-2 font-bold text-sm text-left px-4 transition-all ${form.annualRevenue === r ? "border-[#c8102e] bg-[#c8102e] text-white" : "border-gray-300 hover:border-[#0a1f3d] text-[#0a1f3d]"}`}
                  >{r}</button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-lg font-black text-[#0a1f3d] mb-6">補助金の使用目的を選択してください</h2>
              <div className="grid grid-cols-2 gap-2">
                {PURPOSES.map((p) => (
                  <button key={p} onClick={() => updateForm("purpose", p)}
                    className={`py-4 border-2 font-bold text-sm transition-all ${form.purpose === p ? "border-[#c8102e] bg-[#c8102e] text-white" : "border-gray-300 hover:border-[#0a1f3d] text-[#0a1f3d]"}`}
                  >{p}</button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-lg font-black text-[#0a1f3d] mb-6">事業所の所在地を入力してください</h2>
              <input
                type="text" value={form.area} onChange={(e) => updateForm("area", e.target.value)}
                placeholder="例: 東京都豊島区"
                className="w-full border-2 border-gray-300 px-4 py-3 text-lg font-bold text-[#0a1f3d] focus:border-[#c8102e] outline-none"
              />
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="text-gray-500 hover:text-gray-700 font-medium">← 戻る</button>
            ) : <div />}

            {step < totalSteps ? (
              <button onClick={() => setStep(step + 1)} disabled={!canProceed()}
                className={`px-8 py-3 font-bold transition-all ${canProceed() ? "bg-[#0a1f3d] text-white hover:bg-[#061529]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >次へ →</button>
            ) : (
              <button onClick={handleSubmit} disabled={!canProceed() || loading}
                className={`px-8 py-3 font-bold transition-all ${canProceed() && !loading ? "bg-[#c8102e] hover:bg-[#a50d24] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                {loading ? "AI診断中..." : "AIで診断する ▶"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>個人情報の入力は不要です。診断結果はその場で即時表示されます。</p>
        </div>
      </div>
    </div>
  );
}

export default function DiagnosisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f2eb] flex items-center justify-center"><p className="text-gray-400">読み込み中...</p></div>}>
      <DiagnosisContent />
    </Suspense>
  );
}
