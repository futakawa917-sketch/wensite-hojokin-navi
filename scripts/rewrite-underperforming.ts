import "dotenv/config";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";

// Search Consoleで「11-20位」の記事を検出 → リライトで1ページ目到達を狙う
// 月1回実行想定

import { siteConfig } from "../site.config";
const SITE_URL = (process.env.SITE_URL || siteConfig.url).replace(/\/?$/, "/");
const LOOKBACK_DAYS = 28;

async function getUnderperformingPages() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY || "{}"),
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });

  const webmasters = google.webmasters({ version: "v3", auth });
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - LOOKBACK_DAYS);

  // URL × query の組み合わせで取得
  const response = await webmasters.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
      dimensions: ["page", "query"],
      rowLimit: 200,
    },
  });

  return response.data.rows || [];
}

interface RewriteCandidate {
  slug: string;
  filePath: string;
  targetQueries: string[];
  avgPosition: number;
  totalImpressions: number;
}

function pickCandidates(rows: Array<{ keys?: string[]; clicks?: number; impressions?: number; position?: number }>): RewriteCandidate[] {
  // page単位にグルーピング
  const byPage = new Map<string, { queries: string[]; positions: number[]; impressions: number }>();
  for (const r of rows) {
    const page = r.keys?.[0] ?? "";
    const query = r.keys?.[1] ?? "";
    const pos = r.position ?? 100;
    const imp = r.impressions ?? 0;

    // 11-20位のKWだけ対象
    if (pos < 11 || pos > 20) continue;
    if (imp < 5) continue;

    if (!byPage.has(page)) byPage.set(page, { queries: [], positions: [], impressions: 0 });
    const entry = byPage.get(page)!;
    entry.queries.push(query);
    entry.positions.push(pos);
    entry.impressions += imp;
  }

  const candidates: RewriteCandidate[] = [];
  const articlesDir = path.join(process.cwd(), "content/articles");

  for (const [page, data] of byPage.entries()) {
    const match = page.match(/\/articles\/([^/?#]+)/);
    if (!match) continue;
    const slug = match[1];
    const filePath = path.join(articlesDir, `${slug}.md`);
    if (!fs.existsSync(filePath)) continue;

    const avgPosition = data.positions.reduce((a, b) => a + b, 0) / data.positions.length;
    candidates.push({
      slug,
      filePath,
      targetQueries: data.queries,
      avgPosition,
      totalImpressions: data.impressions,
    });
  }

  // 表示回数多い順
  return candidates.sort((a, b) => b.totalImpressions - a.totalImpressions).slice(0, 3);
}

async function rewriteArticle(candidate: RewriteCandidate) {
  const client = new Anthropic();
  const original = fs.readFileSync(candidate.filePath, "utf-8");

  const prompt = `以下の既存記事は、Googleで以下のクエリで11-20位（2ページ目）に表示されていますが、1ページ目（10位以内）に入っていません。

## 狙うべきクエリ
${candidate.targetQueries.map((q) => `- ${q}`).join("\n")}
平均順位: ${candidate.avgPosition.toFixed(1)}位 / 合計表示回数: ${candidate.totalImpressions}回

## リライトの方針
1. 上記クエリへの最適化: タイトル・見出し・本文に自然に取り込む（検索意図を網羅）
2. E-E-A-T強化: 具体例・数字・経験・一次情報を追加
3. 既存の構造・内部リンクは維持
4. 文字数は1.3〜1.5倍に増量
5. フロントマターの title / description / keywords はクエリに合わせて更新
6. AI定型表現（「いかがでしたでしょうか」等）は絶対に使わない

## 既存記事
${original}

## 出力
リライト後の完全なMarkdown全文のみ（説明不要、フロントマター含む）`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 16384,
    messages: [{ role: "user", content: prompt }],
  });

  const rewritten = message.content[0].type === "text" ? message.content[0].text : "";
  // コードブロック記号を除去
  const cleaned = rewritten.replace(/^```[a-z]*\n?/gm, "").replace(/\n?```$/gm, "");

  fs.writeFileSync(candidate.filePath, cleaned, "utf-8");
  console.log(`Rewrote: ${candidate.slug}`);
  console.log(`  targets: ${candidate.targetQueries.join(", ")}`);
  console.log(`  orig: ${original.length} chars → new: ${cleaned.length} chars`);
}

async function main() {
  console.log("Search Consoleから不調ページ検出中...");
  const rows = await getUnderperformingPages();
  console.log(`取得: ${rows.length}行`);

  if (rows.length === 0) {
    console.log("データがありません");
    return;
  }

  const candidates = pickCandidates(rows);
  console.log(`リライト候補: ${candidates.length}記事`);

  for (const c of candidates) {
    console.log(`\n📝 ${c.slug} (平均${c.avgPosition.toFixed(1)}位)`);
    await rewriteArticle(c);
  }
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
