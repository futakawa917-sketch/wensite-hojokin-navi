import { siteConfig } from "../../../site.config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: `${siteConfig.company.name}の個人情報の取り扱いに関する方針。`,
};

export default function PrivacyPage() {
  const c = siteConfig.company;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-[#c8102e] text-xs font-bold tracking-[0.3em] mb-2">── プライバシーポリシー ──</p>
        <h1 className="font-[family-name:var(--font-noto-serif-jp)] text-3xl md:text-4xl font-black text-[#0a1f3d]">
          個人情報保護方針
        </h1>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-8">
        <p>{c.name}（以下「当社」といいます）は、お客様の個人情報を適切に管理・保護することが社会的責務であると認識し、個人情報保護に関する法令を遵守し、適切な取り扱いに努めます。</p>

        <section>
          <h2 className="text-lg font-bold text-[#0a1f3d] border-l-4 border-[#c8102e] pl-3 mb-3">1. 個人情報の取得</h2>
          <p>当社は、不動産買取のお見積もり、お問い合わせ対応、その他サービス提供のために必要な範囲で、適法かつ公正な手段によりお客様の個人情報を取得します。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0a1f3d] border-l-4 border-[#c8102e] pl-3 mb-3">2. 個人情報の利用目的</h2>
          <p>取得した個人情報は、以下の目的の範囲内で利用します。</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>不動産買取に関するお見積もり・査定のため</li>
            <li>お問い合わせ、ご相談への対応のため</li>
            <li>契約締結および契約に基づくサービス提供のため</li>
            <li>サービス改善およびご案内のため</li>
            <li>法令等に基づく対応のため</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0a1f3d] border-l-4 border-[#c8102e] pl-3 mb-3">3. 第三者提供</h2>
          <p>当社は、法令に基づく場合またはお客様の同意がある場合を除き、取得した個人情報を第三者に提供しません。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0a1f3d] border-l-4 border-[#c8102e] pl-3 mb-3">4. 安全管理</h2>
          <p>当社は、個人情報への不正アクセス、漏洩、滅失、毀損などの防止のため、適切な安全管理措置を講じます。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0a1f3d] border-l-4 border-[#c8102e] pl-3 mb-3">5. 開示・訂正・削除</h2>
          <p>お客様ご本人からの個人情報の開示、訂正、削除などのご要望に対し、法令に基づき適切かつ速やかに対応します。ご要望は本ページ下部のお問い合わせ先までご連絡ください。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0a1f3d] border-l-4 border-[#c8102e] pl-3 mb-3">6. Cookieおよびアクセス解析</h2>
          <p>当サイトでは、サービス改善およびご利用状況把握のため、Google Analyticsなどのアクセス解析ツールを使用し、Cookieを利用することがあります。これらのツールはトラフィックデータの収集のためにCookieを使用していますが、個人を特定する情報は収集しません。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0a1f3d] border-l-4 border-[#c8102e] pl-3 mb-3">7. 改定</h2>
          <p>本方針は、法令や社会情勢の変化に応じて予告なく改定することがあります。改定後の内容は本ページに掲載した時点から効力を有します。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#0a1f3d] border-l-4 border-[#c8102e] pl-3 mb-3">8. お問い合わせ窓口</h2>
          <p>
            {c.name}<br />
            {c.address}<br />
            TEL: {c.phone} / Email: {c.email}
          </p>
        </section>

        <p className="text-right text-xs text-gray-500 mt-8">制定日: {c.privacyPolicyUpdated}</p>
      </div>
    </div>
  );
}
