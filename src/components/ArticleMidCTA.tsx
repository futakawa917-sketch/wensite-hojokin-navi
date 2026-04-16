import { siteConfig } from "../../site.config";

export function ArticleMidCTA() {
  return (
    <div className="my-12 bg-gradient-to-br from-[#0a1f3d] to-[#162a4a] text-white p-8 rounded-xl relative overflow-hidden">
      <div className="relative z-10">
        <p className="text-[#06c755] text-xs font-bold tracking-[0.3em] mb-2">── LINE無料診断 ──</p>
        <h3 className="font-[family-name:var(--font-noto-serif-jp)] text-xl md:text-2xl font-black leading-tight">
          あなたの事業に使える<span className="text-[#06c755]">補助金</span>を無料診断
        </h3>
        <p className="mt-3 text-sm text-gray-300">
          LINEでお友だち追加するだけ。プロが最適な補助金と受給額を無料でお伝えします。
        </p>
        <a
          href={siteConfig.cta.lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 bg-[#06c755] hover:bg-[#05b04a] text-white font-bold px-8 py-3 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.81 2 10.5c0 2.49 1.3 4.73 3.44 6.38-.13.47-.85 3.07-.88 3.27 0 0-.02.14.06.2.08.05.18.02.18.02.24-.03 2.78-1.82 3.94-2.68.72.11 1.48.16 2.26.16 5.52 0 10-3.81 10-8.5S17.52 2 12 2z" /></svg>
          LINEで無料診断する ▶
        </a>
      </div>
    </div>
  );
}
