import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "../../site.config";
import { getArticles } from "@/lib/articles";
import { FaqAccordion } from "@/components/FaqAccordion";
import { HomeDiagnosisForm } from "@/components/HomeDiagnosisForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.description}`,
  description: siteConfig.description,
  openGraph: { title: siteConfig.name, description: siteConfig.description },
};

function JsonLd() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: siteConfig.footer.companyName,
      description: siteConfig.description,
      url: siteConfig.url,
      telephone: siteConfig.cta.phone,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: siteConfig.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function Home() {
  const articles = getArticles().slice(0, 6);

  return (
    <>
      <JsonLd />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[580px] flex items-center overflow-hidden bg-[#f5f2eb]">
        <div className="absolute inset-0 md:right-0 md:left-1/3">
          <Image
            src={siteConfig.heroImage}
            alt="不動産買取"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#f5f2eb] via-[#f5f2eb]/90 to-transparent md:to-[#f5f2eb]/0" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 w-full">
          <div className="max-w-xl">
            <div className="inline-block bg-[#0a1f3d] text-white text-xs font-bold px-4 py-1.5 mb-5 tracking-wider">
              ― 不動産買取専門 ―
            </div>
            <h1 className="font-[family-name:var(--font-noto-serif-jp)] text-3xl md:text-5xl font-black leading-[1.2] tracking-tight text-[#0a1f3d]">
              古い家・空き家<br />
              <span className="relative inline-block">
                <span className="relative z-10">そのまま買取</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#c8102e]/20 -z-0" />
              </span><br />
              いたします。
            </h1>
            <p className="mt-6 text-sm md:text-base text-gray-700 leading-relaxed">
              築年数・状態を問わず、AIが即時査定。<br />
              仲介手数料0円、最短3日で現金化します。
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["買取実績500件以上", "全国対応", "秘密厳守"].map((badge) => (
                <span
                  key={badge}
                  className="bg-white border border-[#0a1f3d]/20 text-[#0a1f3d] text-xs font-bold px-3 py-1.5"
                >
                  ◉ {badge}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="#diagnosis"
                className="bg-[#c8102e] hover:bg-[#a50d24] text-white font-bold px-8 py-4 text-center transition-colors"
              >
                無料AI査定を始める　▶
              </Link>
              <a
                href={`tel:${siteConfig.cta.phone}`}
                className="bg-white border-2 border-[#0a1f3d] text-[#0a1f3d] font-bold px-8 py-4 text-center hover:bg-[#0a1f3d] hover:text-white transition-colors"
              >
                ☎ {siteConfig.cta.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AI査定フォーム ===== */}
      <section id="diagnosis" className="bg-[#0a1f3d] py-16 relative">
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-[#c9a961] text-xs font-bold tracking-[0.3em] mb-3">── 無料AI査定 ──</p>
            <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-3xl md:text-4xl font-black text-white leading-tight">
              30秒で買取価格がわかる
            </h2>
            <p className="mt-3 text-gray-300 text-sm">
              個人情報不要・匿名でご利用いただけます
            </p>
          </div>

          <HomeDiagnosisForm />

          <p className="text-center text-xs text-gray-400 mt-4">
            ※ AI診断は概算です。正確な査定は現地調査後に確定します。
          </p>
        </div>
      </section>

      {/* ===== 実績数字 ===== */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "500", unit: "件+", label: "累計買取実績" },
              { num: "3", unit: "日", label: "最短現金化" },
              { num: "0", unit: "円", label: "仲介手数料" },
              { num: "98", unit: "%", label: "お客様満足度" },
            ].map((item) => (
              <div key={item.label} className="border-l-2 border-[#c8102e] pl-4 text-left">
                <p className="text-xs text-gray-500 font-bold mb-1">{item.label}</p>
                <p className="font-[family-name:var(--font-noto-serif-jp)] text-3xl md:text-4xl font-black text-[#0a1f3d]">
                  {item.num}<span className="text-xl text-[#c8102e] ml-1">{item.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== こんなお悩み ===== */}
      <section className="bg-[#f5f2eb] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[#c8102e] text-xs font-bold tracking-[0.3em] mb-2">── お悩み ──</p>
            <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-2xl md:text-3xl font-black text-[#0a1f3d]">
              こんなお悩みはございませんか？
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={siteConfig.worriesImage}
                alt="悩むお客様"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              {[
                "古い実家を相続したが、住む予定がない",
                "空き家の管理費や固定資産税が負担",
                "他社で「築年数が古い」と断られた",
                "離婚・転勤で急いで現金化したい",
                "家の中に荷物が残ったまま",
                "近隣に知られず売却したい",
              ].map((worry) => (
                <div
                  key={worry}
                  className="bg-white p-4 flex items-start gap-3 border-l-4 border-[#c8102e]"
                >
                  <span className="text-[#c8102e] font-black flex-shrink-0">✓</span>
                  <p className="text-sm font-bold text-[#0a1f3d]">{worry}</p>
                </div>
              ))}
              <p className="text-center text-[#c8102e] font-black text-lg pt-4 font-[family-name:var(--font-noto-serif-jp)]">
                すべて当社が解決いたします
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 選ばれる理由 ===== */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#c8102e] text-xs font-bold tracking-[0.3em] mb-2">── 選ばれる理由 ──</p>
            <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-2xl md:text-3xl font-black text-[#0a1f3d]">
              当社が選ばれる<span className="text-[#c8102e]">5つ</span>の理由
            </h2>
          </div>
          <div className="space-y-4">
            {siteConfig.reasons.map((reason) => (
              <div
                key={reason.number}
                className="border border-gray-200 bg-white p-6 flex flex-col md:flex-row gap-5"
              >
                <div className="flex items-baseline gap-2 flex-shrink-0 md:w-40">
                  <span className="text-xs font-bold text-[#c8102e] tracking-widest">REASON</span>
                  <span className="font-[family-name:var(--font-noto-serif-jp)] text-4xl font-black text-[#0a1f3d]">
                    {reason.number}
                  </span>
                </div>
                <div className="border-l border-gray-200 md:pl-5">
                  <h3 className="text-lg font-black text-[#0a1f3d] mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 買取対象 ===== */}
      <section className="bg-[#f5f2eb] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#c8102e] text-xs font-bold tracking-[0.3em] mb-2">── 買取対象 ──</p>
            <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-2xl md:text-3xl font-black text-[#0a1f3d]">
              こんな物件も買取いたします
            </h2>
            <p className="mt-3 text-gray-600 text-sm">他社で断られた物件もお任せください</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {siteConfig.targetProperties.map((prop) => (
              <div
                key={prop}
                className="bg-white p-4 text-center border border-gray-200 hover:border-[#c8102e] transition-colors"
              >
                <p className="font-bold text-[#0a1f3d] text-sm">
                  <span className="text-[#c8102e] mr-1">◉</span>{prop}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 買取の流れ ===== */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#c8102e] text-xs font-bold tracking-[0.3em] mb-2">── 買取の流れ ──</p>
            <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-2xl md:text-3xl font-black text-[#0a1f3d]">
              買取完了までの流れ
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {siteConfig.steps.map((step, i) => (
              <div key={step.number} className="relative">
                {i < siteConfig.steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 z-10 -translate-y-1/2 text-[#c8102e] text-2xl font-black">
                    ▶
                  </div>
                )}
                <div className="bg-[#f5f2eb] p-6 text-center h-full border-t-4 border-[#c8102e]">
                  <p className="text-xs font-bold text-[#c8102e] tracking-widest mb-2">STEP {step.number}</p>
                  <h3 className="font-[family-name:var(--font-noto-serif-jp)] font-black text-[#0a1f3d] text-lg">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-xs text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== お客様の声 ===== */}
      <section className="bg-[#f5f2eb] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#c8102e] text-xs font-bold tracking-[0.3em] mb-2">── お客様の声 ──</p>
            <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-2xl md:text-3xl font-black text-[#0a1f3d]">
              ご利用いただいたお客様の声
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {siteConfig.testimonials.map((t) => (
              <div key={t.name} className="bg-white p-6 border-t-4 border-[#c8102e]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-14 h-14 overflow-hidden flex-shrink-0 rounded-full">
                    <Image src={t.photo} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0a1f3d]">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.age} / {t.area}</p>
                  </div>
                </div>
                <div className="inline-block bg-[#0a1f3d] text-white text-xs font-bold px-3 py-1 mb-3">
                  【{t.property}】
                </div>
                <div className="flex text-[#c9a961] mb-3">
                  {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">「{t.text}」</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 買取実績 ===== */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#c8102e] text-xs font-bold tracking-[0.3em] mb-2">── 買取実績 ──</p>
            <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-2xl md:text-3xl font-black text-[#0a1f3d]">
              直近の買取実績
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {siteConfig.results.map((result, i) => (
              <div key={i} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="relative h-44">
                  <Image
                    src={result.image}
                    alt={`${result.type}（${result.area}）`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-0 left-0 bg-[#0a1f3d] text-white text-xs font-bold px-3 py-1">
                    【{result.type}】
                  </div>
                  <div className="absolute bottom-0 right-0 bg-[#c8102e] text-white text-xs font-bold px-3 py-1">
                    最短{result.period}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-600 font-bold">{result.area}</p>
                  <p className="text-xs text-gray-500 mt-1">{result.size}</p>
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-500">買取価格</p>
                    <p className="font-[family-name:var(--font-noto-serif-jp)] text-3xl font-black text-[#c8102e]">
                      {result.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== スタッフ紹介 ===== */}
      <section className="bg-[#f5f2eb] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={siteConfig.staffImage}
                alt="専門スタッフ"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[#c8102e] text-xs font-bold tracking-[0.3em] mb-2">── 専門スタッフ ──</p>
              <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-2xl md:text-3xl font-black text-[#0a1f3d] leading-tight">
                経験豊富な専門スタッフが<br />最後までサポート
              </h2>
              <p className="mt-5 text-gray-700 leading-relaxed text-sm">
                不動産買取のプロとして、お客様一人ひとりの状況に寄り添ったご提案をいたします。相続・離婚・ローン残債など、複雑な事情もご相談ください。
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { num: "10年+", label: "業界経験" },
                  { num: "宅建", label: "有資格者" },
                  { num: "全国", label: "対応可能" },
                ].map((item) => (
                  <div key={item.label} className="bg-white p-4 text-center border-t-2 border-[#c8102e]">
                    <p className="font-[family-name:var(--font-noto-serif-jp)] text-lg font-black text-[#0a1f3d]">{item.num}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="mt-6 inline-block bg-[#0a1f3d] hover:bg-[#061529] text-white font-bold px-8 py-3 transition-colors"
              >
                スタッフに相談する ▶
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[#c8102e] text-xs font-bold tracking-[0.3em] mb-2">── よくある質問 ──</p>
            <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-2xl md:text-3xl font-black text-[#0a1f3d]">
              よくいただくご質問
            </h2>
          </div>
          <FaqAccordion items={siteConfig.faq} />
        </div>
      </section>

      {/* ===== コラム ===== */}
      {articles.length > 0 && (
        <section className="bg-[#f5f2eb] py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-[#c8102e] text-xs font-bold tracking-[0.3em] mb-2">── お役立ちコラム ──</p>
              <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-2xl md:text-3xl font-black text-[#0a1f3d]">
                不動産売却の基礎知識
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="block bg-white hover:shadow-lg transition-shadow border-t-4 border-[#0a1f3d]"
                >
                  <div className="p-6">
                    <time className="text-xs text-gray-400 font-bold">{article.date}</time>
                    <h3 className="mt-2 font-bold text-[#0a1f3d] line-clamp-2 text-base leading-snug">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {article.description}
                    </p>
                    <span className="mt-4 inline-block text-[#c8102e] text-sm font-bold">
                      続きを読む ▶
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/articles"
                className="inline-block border-2 border-[#0a1f3d] text-[#0a1f3d] hover:bg-[#0a1f3d] hover:text-white font-bold px-8 py-3 transition-colors"
              >
                コラム一覧を見る
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== 最終CTA ===== */}
      <section className="relative py-20 overflow-hidden bg-[#0a1f3d]">
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center text-white">
          <p className="text-[#c9a961] text-xs font-bold tracking-[0.3em] mb-3">── お気軽にご相談ください ──</p>
          <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-3xl md:text-4xl font-black leading-tight">
            まずは<span className="text-[#c9a961]">無料AI査定</span>で<br />
            今の買取価格を確認
          </h2>
          <p className="mt-5 text-gray-300 text-sm">
            個人情報不要・完全匿名・相談無料
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="#diagnosis"
              className="bg-[#c8102e] hover:bg-[#a50d24] text-white font-bold px-10 py-4 transition-colors"
            >
              無料AI査定を始める ▶
            </Link>
            <a
              href={`tel:${siteConfig.cta.phone}`}
              className="bg-transparent border-2 border-white text-white font-bold px-10 py-4 hover:bg-white hover:text-[#0a1f3d] transition-colors"
            >
              ☎ {siteConfig.cta.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
