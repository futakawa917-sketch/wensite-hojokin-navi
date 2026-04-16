import Link from "next/link";

export function ArticleMidCTA() {
  return (
    <div className="my-12 bg-gradient-to-br from-[#0a1f3d] to-[#162a4a] text-white p-8 rounded-xl relative overflow-hidden">
      <div className="relative z-10">
        <p className="text-[#c9a961] text-xs font-bold tracking-[0.3em] mb-2">── AI即時診断 ──</p>
        <h3 className="font-[family-name:var(--font-noto-serif-jp)] text-xl md:text-2xl font-black leading-tight">
          30秒で<span className="text-[#c9a961]">使える補助金</span>がわかる
        </h3>
        <p className="mt-3 text-sm text-gray-300">
          個人情報不要・匿名OK。AIが事業内容から最適な補助金と受給額を即時診断します。
        </p>
        <Link
          href="/diagnosis"
          className="mt-5 inline-block bg-[#c8102e] hover:bg-[#a50d24] text-white font-bold px-8 py-3 transition-colors"
        >
          無料でAI補助金診断する ▶
        </Link>
      </div>
    </div>
  );
}
