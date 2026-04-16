"use client";

import { siteConfig } from "../../../site.config";
import { useState } from "react";

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
  }
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = { source: "contact_form" };
    formData.forEach((v, k) => {
      payload[k] = v.toString();
    });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "送信失敗");

      // GA4コンバージョンイベント送信
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "generate_lead", {
          currency: "JPY",
          value: 10000,
          property_type: payload.propertyType || "",
          source: payload.source,
        });
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-6">&#10003;</div>
        <h1 className="text-2xl font-bold">お問い合わせありがとうございます</h1>
        <p className="mt-4 text-gray-600">内容を確認のうえ、担当者よりご連絡いたします。</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">{siteConfig.contactForm.title}</h1>
      <p className="text-center text-gray-500 mb-10">お気軽にご相談ください。すべて無料です。</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {siteConfig.contactForm.fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === "select" && "options" in field ? (
              <select
                id={field.name}
                name={field.name}
                required={field.required}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none"
              >
                <option value="">選択してください</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                required={field.required}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none"
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                required={field.required}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#c8102e] focus:border-transparent outline-none"
              />
            )}
          </div>
        ))}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#c8102e] hover:bg-[#a50d24] disabled:bg-gray-300 text-white font-bold py-4 rounded-full text-lg transition-colors"
        >
          {loading ? "送信中..." : "無料で査定を依頼する"}
        </button>
      </form>

      <div className="mt-10 text-center text-gray-500 text-sm">
        <p>お電話でのご相談はこちら</p>
        <a href={`tel:${siteConfig.cta.phone}`} className="text-2xl font-bold text-[#c8102e] block mt-2">
          {siteConfig.cta.phone}
        </a>
      </div>
    </div>
  );
}
