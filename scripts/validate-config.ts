import { siteConfig } from "../site.config";

/**
 * デプロイ前の設定検証スクリプト
 * GitHub Actionsのビルド時に実行し、設定漏れを検出してデプロイを止める
 */

const errors: string[] = [];
const warnings: string[] = [];

// 1. URL がプレースホルダのままでないか
if (siteConfig.url.includes("wensite-chi") || siteConfig.url.includes("example.com")) {
  errors.push("site.config.ts の url がテンプレートのままです。デプロイ先のURLに変更してください。");
}
if (!siteConfig.url.startsWith("https://")) {
  errors.push("site.config.ts の url は https:// で始まる必要があります。");
}

// 2. 会社情報がプレースホルダのままでないか
if (siteConfig.company.name.includes("サンプル")) {
  errors.push("company.name が「サンプル」のままです。実際の会社名に変更してください。");
}
if (siteConfig.company.representative.includes("山田 太郎")) {
  errors.push("company.representative がテンプレートのままです。");
}
if (siteConfig.company.address.includes("...")) {
  errors.push("company.address が不完全です。正確な住所を入力してください。");
}
if (siteConfig.company.license.includes("XXXXX")) {
  errors.push("company.license がテンプレートのままです。実際の免許番号を入力してください。");
}

// 3. CTA がプレースホルダのままでないか
if (siteConfig.cta.phone === "0120-000-0000") {
  errors.push("cta.phone がテンプレートのままです。");
}
if (siteConfig.cta.email === "info@example.com") {
  errors.push("cta.email がテンプレートのままです。");
}
if (siteConfig.cta.lineId === "@example") {
  warnings.push("cta.lineId がテンプレートのままです（LINE未使用なら無視可）。");
}

// 4. 記事トピックが存在するか
if (!siteConfig.articles.topicsPool || siteConfig.articles.topicsPool.length === 0) {
  errors.push("articles.topicsPool が空です。記事生成ができません。");
}

// 5. サイト名が空でないか
if (!siteConfig.name || siteConfig.name.length < 2) {
  errors.push("site name が未設定です。");
}

// 6. SEOキーワードがあるか
if (!siteConfig.articles.seo.targetKeywords || siteConfig.articles.seo.targetKeywords.length === 0) {
  errors.push("articles.seo.targetKeywords が空です。SEO効果が出ません。");
}

// 結果出力
if (warnings.length > 0) {
  console.log("\n⚠️  警告:");
  for (const w of warnings) console.log(`  - ${w}`);
}

if (errors.length > 0) {
  console.log("\n❌ 設定エラー:");
  for (const e of errors) console.log(`  - ${e}`);
  console.log(`\n${errors.length}件のエラーがあります。site.config.ts を修正してください。`);
  process.exit(1);
} else {
  console.log("\n✅ 設定検証OK: site.config.ts の設定に問題ありません。");
  console.log(`  サイト名: ${siteConfig.name}`);
  console.log(`  URL: ${siteConfig.url}`);
  console.log(`  会社名: ${siteConfig.company.name}`);
  console.log(`  記事トピック: ${siteConfig.articles.topicsPool.length}件`);
}
