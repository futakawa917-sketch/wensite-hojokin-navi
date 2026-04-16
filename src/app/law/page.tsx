import { siteConfig } from "../../../site.config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: `${siteConfig.company.name}における特定商取引法に基づく表記。`,
};

export default function LawPage() {
  const c = siteConfig.company;
  const rows = [
    { label: "販売業者", value: c.name },
    { label: "運営責任者", value: c.representative },
    { label: "所在地", value: c.address },
    { label: "電話番号", value: c.phone },
    { label: "メールアドレス", value: c.email },
    { label: "免許番号", value: c.license },
    { label: "事業内容", value: c.business },
    {
      label: "サービスの対価",
      value: "当社は不動産の買取を行います。買取価格は物件の状態・所在地・築年数等により個別に算定しご提示します。査定・相談は無料です。",
    },
    { label: "支払方法", value: "銀行振込" },
    { label: "支払時期", value: "売買契約成立後、物件引渡と同時に一括でお支払いします。" },
    {
      label: "引渡時期",
      value: "契約締結後、登記手続きが完了した時点でお引渡しいただきます（通常3〜30日以内）。",
    },
    {
      label: "キャンセルについて",
      value: "業務委託契約締結前であれば、いつでもキャンセル可能です。契約締結後のキャンセルは、個別契約書の定めに従います。",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-[#c8102e] text-xs font-bold tracking-[0.3em] mb-2">── 特定商取引法に基づく表記 ──</p>
        <h1 className="font-[family-name:var(--font-noto-serif-jp)] text-3xl md:text-4xl font-black text-[#0a1f3d]">
          特定商取引法に基づく表記
        </h1>
      </div>

      <table className="w-full border-t border-gray-200">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-gray-200">
              <th className="text-left text-sm font-bold text-[#0a1f3d] bg-[#f5f2eb] px-5 py-4 w-1/3 md:w-1/4 align-top">
                {row.label}
              </th>
              <td className="px-5 py-4 text-sm text-gray-700 leading-relaxed">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-right text-xs text-gray-500 mt-8">最終更新: {c.lawUpdated}</p>
    </div>
  );
}
