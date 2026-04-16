"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-[#c8102e] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                Q
              </span>
              <span className="font-bold text-[#1a1a1a] text-sm md:text-base">{item.question}</span>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 flex-shrink-0 ml-4 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === i && (
            <div className="px-5 pb-5 border-t border-gray-100">
              <div className="flex items-start gap-3 pt-4">
                <span className="w-7 h-7 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  A
                </span>
                <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
