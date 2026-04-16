import { siteConfig } from "../../../site.config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "運営者情報",
  description: `${siteConfig.company.name}の会社概要・運営者情報。代表者、所在地、宅建業免許番号などを掲載しています。`,
};

export default function CompanyPage() {
  const c = siteConfig.company;
  const rows = [
    { label: "会社名", value: c.name },
    { label: "代表者", value: c.representative },
    { label: "設立", value: c.established },
    { label: "資本金", value: c.capital },
    { label: "事業内容", value: c.business },
    { label: "免許番号", value: c.license },
    { label: "所在地", value: c.address },
    { label: "電話番号", value: c.phone },
    { label: "メール", value: c.email },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-[#c8102e] text-xs font-bold tracking-[0.3em] mb-2">── 運営者情報 ──</p>
        <h1 className="font-[family-name:var(--font-noto-serif-jp)] text-3xl md:text-4xl font-black text-[#0a1f3d]">
          会社概要
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
    </div>
  );
}
