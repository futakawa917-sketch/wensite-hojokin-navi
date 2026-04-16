import { siteConfig } from "../../site.config";

export function FloatingCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] z-50 md:hidden">
      <div className="flex items-stretch">
        <a
          href={`tel:${siteConfig.cta.phone}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-white border-r border-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-xs font-bold">電話</span>
        </a>
        <a
          href="/contact"
          className="flex-1 flex items-center justify-center gap-2 py-3 text-white border-r border-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-bold">メール</span>
        </a>
        <a
          href={siteConfig.cta.lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#06c755] text-white"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 5.81 2 10.5c0 2.49 1.3 4.73 3.44 6.38-.13.47-.85 3.07-.88 3.27 0 0-.02.14.06.2.08.05.18.02.18.02.24-.03 2.78-1.82 3.94-2.68.72.11 1.48.16 2.26.16 5.52 0 10-3.81 10-8.5S17.52 2 12 2z" />
          </svg>
          <span className="text-xs font-bold">LINE</span>
        </a>
      </div>
    </div>
  );
}
