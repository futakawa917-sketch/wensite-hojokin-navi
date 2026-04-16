#!/usr/bin/env npx tsx
import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * 新規サイト自動構築スクリプト
 *
 * 使い方:
 *   npx tsx scripts/create-new-site.ts --industry "補助金申請サポート" --company "株式会社ホジョキン" --slug hojokin-navi
 *
 * やること:
 *   1. Claude APIで業界に合わせたsite.config.tsを自動生成
 *   2. GitHubに新リポジトリを作成（テンプレートからコピー）
 *   3. 生成したconfigを書き込み、不動産の記事データを削除
 *   4. Vercelプロジェクト作成・デプロイ
 *   5. GitHub Secretsを共通キーから設定
 */

const TEMPLATE_REPO = "futakawa917-sketch/wensite";
const GITHUB_ORG = "futakawa917-sketch";

function run(cmd: string, opts: { cwd?: string; stdio?: "inherit" | "pipe" } = {}) {
  console.log(`  $ ${cmd}`);
  return execSync(cmd, { encoding: "utf-8", stdio: opts.stdio || "pipe", cwd: opts.cwd }).trim();
}

function parseArgs() {
  const args: Record<string, string> = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--") && i + 1 < argv.length) {
      args[argv[i].replace("--", "")] = argv[i + 1];
      i++;
    }
  }
  return args;
}

async function generateSiteConfig(industry: string, companyName: string, slug: string): Promise<string> {
  console.log("\n🤖 Claude APIでsite.config.tsを生成中...");
  const client = new Anthropic();

  const result = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    temperature: 0.7,
    messages: [{
      role: "user",
      content: `あなたはリード獲得サイトのコンテンツ設計者です。
以下の業界・会社情報に基づいて、site.config.tsの内容をTypeScriptで生成してください。

業界: ${industry}
会社名: ${companyName}
サイトスラッグ: ${slug}

以下のフォーマットで出力してください。全てのフィールドを日本語で、リアルなダミーデータを使って埋めてください。
記事トピック(topicsPool)は最低30個、SEOを意識したロングテールキーワードで生成してください。

\`\`\`typescript
export const siteConfig = {
  name: "サイト名",
  description: "メタディスクリプション（150文字以内）",
  url: "https://${slug}.vercel.app",

  heroImage: "業界に合うUnsplash画像URL（?w=1920&q=80付き）",
  staffImage: "スタッフ風のUnsplash画像URL（?w=600&q=80付き）",
  worriesImage: "悩みを表すUnsplash画像URL（?w=800&q=80付き）",

  testimonials: [
    // 3件。業界に合ったリアルなお客様の声
    { name: "X.X様", age: "XX代", area: "XX県", photo: "Unsplash URL", property: "利用サービス", text: "感想" },
  ],

  colors: {
    primary: "#hex",     // 業界に合ったメインカラー
    primaryHover: "#hex",
    accent: "#hex",      // 業界に合ったアクセントカラー
    accentHover: "#hex",
    bg: "#F1F1EF",
    bgWhite: "#ffffff",
  },

  hero: {
    title: "キャッチコピー（改行は\\nで）",
    subtitle: "サブコピー",
    ctaText: "CTA文言",
  },

  trustPoints: [
    // 4つ。業界の強み
    { icon: "絵文字", title: "タイトル", description: "説明" },
  ],

  cta: {
    phone: "0120-000-0000",
    lineUrl: "https://line.me/R/",
    lineId: "@${slug}",
    email: "info@example.com",
  },

  contactForm: {
    title: "フォームタイトル",
    fields: [
      // 業界に合ったフォームフィールド
      { name: "name", label: "お名前", type: "text", required: true },
      { name: "phone", label: "電話番号", type: "tel", required: true },
      { name: "email", label: "メールアドレス", type: "email", required: false },
      // 業界固有のフィールドを追加
    ],
  },

  articles: {
    topicsPool: [
      // 最低30個のSEO記事トピック
      // カテゴリ別にコメント付きで
    ],
    wordsPerArticle: 3000,
    seo: {
      targetKeywords: ["メインKW", "サブKW1", "サブKW2", "サブKW3", "サブKW4"],
      internalLinkCta: "CTA文言",
      ctaUrl: "/contact",
    },
    // 業界に合った記事画像カテゴリ
    images: {
      general: ["Unsplash URL x3"],
      // 業界固有のカテゴリを2-4個追加
    },
  },

  topicCluster: {
    pillar: { slug: "pillar-${slug}-guide", title: "ピラーページタイトル" },
    clusters: [],
  },

  results: [
    // 6件の実績（業界に合わせたダミー）
  ],

  reasons: [
    // 5つの選ばれる理由
  ],

  targetProperties: [
    // 8つの対象サービス/対象顧客
  ],

  faq: [
    // 8つのFAQ
  ],

  steps: [
    // 4ステップの利用の流れ
  ],

  nav: [
    { label: "ホーム", href: "/" },
    { label: "AI診断", href: "/diagnosis" },
    { label: "コラム", href: "/articles" },
    { label: "無料相談", href: "/contact" },
  ],

  footer: {
    companyName: "${companyName}",
    address: "東京都...",
  },

  company: {
    name: "${companyName}",
    representative: "代表取締役 ...",
    established: "20XX年X月",
    capital: "X,000万円",
    address: "〒XXX-XXXX ...",
    phone: "0120-000-0000",
    email: "info@example.com",
    license: "業界の許認可（あれば）",
    business: "事業内容",
    privacyPolicyUpdated: "${new Date().toISOString().split("T")[0]}",
    lawUpdated: "${new Date().toISOString().split("T")[0]}",
  },
} as const;

export type SiteConfig = typeof siteConfig;
\`\`\`

重要:
- Unsplash画像URLは実在するものを使用（unsplash.comで見つかるもの）
- 全て日本語で出力
- topicsPoolは「検索意図: Know/Do/Compare」のバランスを取る
- TypeScriptとして有効なコードを出力（as const を忘れずに）
- コードブロック内にTypeScriptコードのみを出力（説明不要）`,
    }],
  });

  const text = result.content[0].type === "text" ? result.content[0].text : "";
  const match = text.match(/```typescript\n([\s\S]*?)```/);
  if (!match) throw new Error("Claude APIからsite.config.tsの生成に失敗しました");
  return match[1];
}

async function main() {
  const args = parseArgs();

  if (!args.industry || !args.slug) {
    console.log(`使い方:
  npx tsx scripts/create-new-site.ts \\
    --industry "業界名（例: 補助金申請サポート）" \\
    --company "会社名（例: 株式会社ホジョキン）" \\
    --slug "リポジトリ名（例: hojokin-navi）"

オプション:
  --skip-deploy    Vercelデプロイをスキップ
  --dry-run        実際の作成をせず、site.config.tsの生成のみ`);
    process.exit(1);
  }

  const industry = args.industry;
  const company = args.company || `${industry}サポート`;
  const slug = args.slug;
  const repoName = `wensite-${slug}`;
  const dryRun = "dry-run" in args || process.argv.includes("--dry-run");
  const skipDeploy = "skip-deploy" in args || process.argv.includes("--skip-deploy");

  console.log("=== 新規サイト自動構築 ===");
  console.log(`  業界: ${industry}`);
  console.log(`  会社名: ${company}`);
  console.log(`  リポジトリ: ${GITHUB_ORG}/${repoName}`);
  console.log(`  URL: https://${slug}.vercel.app`);
  console.log("");

  // Step 1: Claude APIでsite.config.tsを生成
  const configContent = await generateSiteConfig(industry, company, slug);

  if (dryRun) {
    console.log("\n--- 生成されたsite.config.ts ---");
    console.log(configContent);
    console.log("\n(dry-run モード: ここで終了)");
    return;
  }

  // Step 2: GitHubリポジトリ作成
  console.log("\n📦 GitHubリポジトリを作成中...");
  const workDir = path.join(process.env.HOME || "/tmp", "Desktop", repoName);

  try {
    run(`gh repo view ${GITHUB_ORG}/${repoName} --json name`, { stdio: "pipe" });
    console.log(`  ⚠ リポジトリ ${repoName} は既に存在します。スキップ。`);
  } catch {
    run(`gh repo create ${GITHUB_ORG}/${repoName} --private --clone`, { cwd: path.dirname(workDir) });
  }

  // テンプレートからファイルをコピー
  if (!fs.existsSync(workDir)) {
    const templateDir = path.resolve(__dirname, "..");
    console.log("  テンプレートからファイルをコピー中...");
    run(`git clone https://github.com/${TEMPLATE_REPO}.git ${workDir}`);
    run("git remote remove origin", { cwd: workDir });
    run(`git remote add origin https://github.com/${GITHUB_ORG}/${repoName}.git`, { cwd: workDir });
  }

  // Step 3: site.config.tsを書き換え
  console.log("\n✏️  site.config.tsを書き換え中...");
  fs.writeFileSync(path.join(workDir, "site.config.ts"), configContent);

  // 不動産のサンプル記事を削除
  const articlesDir = path.join(workDir, "content/articles");
  if (fs.existsSync(articlesDir)) {
    const articles = fs.readdirSync(articlesDir).filter(f => f.endsWith(".md"));
    for (const f of articles) fs.unlinkSync(path.join(articlesDir, f));
    console.log(`  ${articles.length}件のサンプル記事を削除`);
  }

  // 学習データを削除
  const dataDir = path.join(workDir, "data");
  if (fs.existsSync(dataDir)) {
    for (const f of fs.readdirSync(dataDir).filter(f => f.endsWith(".json"))) {
      fs.unlinkSync(path.join(dataDir, f));
    }
    console.log("  学習データを削除");
  }

  // Step 4: コミット＆プッシュ
  console.log("\n📤 GitHubにプッシュ中...");
  run("git add -A", { cwd: workDir });
  run(`git commit -m "初期セットアップ: ${industry}サイト"`, { cwd: workDir });
  run("git push -u origin main --force", { cwd: workDir });
  console.log("  ✓ プッシュ完了");

  // Step 5: GitHub Secretsを設定（共通キーを流用）
  console.log("\n🔐 GitHub Secretsを設定中...");
  const secrets = ["ANTHROPIC_API_KEY", "GCP_SERVICE_ACCOUNT_KEY"];
  for (const key of secrets) {
    const val = process.env[key];
    if (val) {
      try {
        execSync(`echo "${val}" | gh secret set ${key} --repo ${GITHUB_ORG}/${repoName}`, {
          encoding: "utf-8",
          stdio: "pipe",
        });
        console.log(`  ✓ ${key} を設定`);
      } catch (e) {
        console.log(`  ⚠ ${key} の設定に失敗（手動で設定してください）`);
      }
    } else {
      console.log(`  ⚠ ${key} が環境変数にないためスキップ`);
    }
  }

  // LEADS_SHEET_IDは新規作成が必要なのでスキップ
  console.log("  ℹ LEADS_SHEET_ID は手動で設定してください（新規Googleシートが必要）");

  // Step 6: Vercelデプロイ
  if (!skipDeploy) {
    console.log("\n🚀 Vercelにデプロイ中...");
    try {
      run(`vercel link --yes --project ${slug}`, { cwd: workDir });
      run("vercel --prod --yes", { cwd: workDir });
      console.log(`  ✓ デプロイ完了: https://${slug}.vercel.app`);
    } catch (e) {
      console.log("  ⚠ Vercelデプロイに失敗。手動で実行してください:");
      console.log(`    cd ${workDir} && vercel --prod`);
    }
  }

  // 完了
  console.log("\n✅ 新規サイト作成完了!");
  console.log(`  リポジトリ: https://github.com/${GITHUB_ORG}/${repoName}`);
  console.log(`  URL: https://${slug}.vercel.app`);
  console.log("");
  console.log("残りの手動作業:");
  console.log("  1. site.config.ts の会社情報を実際の情報に書き換え");
  console.log("  2. LEADS_SHEET_ID をGitHub Secretsに設定");
  console.log("  3. Search ConsoleにURLを登録");
  console.log("  4. Vercel環境変数にANTHROPIC_API_KEYを設定");
}

main().catch((e) => {
  console.error("❌ エラー:", e.message);
  process.exit(1);
});
