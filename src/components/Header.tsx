"use client";

import Link from "next/link";
import { siteConfig } from "../../site.config";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Top bar (PC only) */}
      <div className="hidden md:block bg-[#0a1f3d] text-white">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-end gap-6 h-9 text-xs">
          <a href={`tel:${siteConfig.cta.phone}`} className="flex items-center gap-1 font-bold">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {siteConfig.cta.phone}
          </a>
          <a href={`mailto:${siteConfig.cta.email}`} className="hover:underline">メール相談</a>
          <a href={siteConfig.cta.lineUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">LINE相談</a>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="font-black text-lg text-[#0a1f3d]">
          {siteConfig.name}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-600 hover:text-[#0a1f3d] transition-colors text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={siteConfig.cta.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#06c755] hover:bg-[#05b04a] text-white px-5 py-2 font-bold text-sm transition-colors"
          >
            LINE無料相談
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          <svg className="w-6 h-6 text-[#0a1f3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-3">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 font-medium py-2 border-b border-gray-50"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={siteConfig.cta.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#06c755] text-white text-center py-3 font-bold mt-2"
            onClick={() => setMenuOpen(false)}
          >
            LINE無料相談はこちら
          </a>
        </nav>
      )}
    </header>
  );
}
