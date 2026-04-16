import "dotenv/config";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";

// Search Console から流入KW・順位を取得し、記事ネタに変換して保存する
// 週1回 GitHub Actions で実行する想定

import { siteConfig } from "../site.config";
const SITE_URL = (process.env.SITE_URL || siteConfig.url).replace(/\/?$/, "/");
const LOOKBACK_DAYS = 28;

async function getSearchConsoleData() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY || "{}"),
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });

  const webmasters = google.webmasters({ version: "v3", auth });
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - LOOKBACK_DAYS);

  const response = await webmasters.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
      dimensions: ["query"],
      rowLimit: 100,
    },
  });

  return response.data.rows || [];
}

interface KeywordInsight {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  opportunity: "high_impression_low_position" | "ranking_opportunity" | "proven_topic";
}

function classifyKeywords(rows: Array<{ keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number }>): KeywordInsight[] {
  return rows
    .filter((r) => (r.impressions ?? 0) >= 5) // 表示回数5以上
    .map((r) => {
      const query = r.keys?.[0] ?? "";
      const clicks = r.clicks ?? 0;
      const impressions = r.impressions ?? 0;
      const ctr = r.ctr ?? 0;
      const position = r.position ?? 100;

      let opportunity: KeywordInsight["opportunity"];
      if (position > 10 && position <= 20 && impressions > 10) {
        opportunity = "ranking_opportunity"; // 11-20位 → あと一押しで1ページ目
      } else if (position > 20 && impressions > 20) {
        opportunity = "high_impression_low_position"; // 検索ニーズはあるが順位低い
      } else {
        opportunity = "proven_topic"; // 上位取れてる = 関連トピック強化の価値あり
      }

      return { query, clicks, impressions, ctr, position, opportunity };
    });
}

async function generateRelatedTopics(insights: KeywordInsight[], exclusionList: string[]): Promise<string[]> {
  if (insights.length === 0) return [];

  const client = new Anthropic();
  const topInsights = insights.slice(0, 20);

  const prompt = `以下はSearch Consoleから取得した不動産買取サイトの流入キーワードデータです。
このデータをもとに、次に書くべき記事トピックを10本提案してください。

## データ（KW / 表示回数 / 順位 / 種別）
${topInsights.map((i) => `- ${i.query} / 表示${i.impressions}回 / 順位${i.position.toFixed(1)}位 / ${i.opportunity}`).join("\n")}

## 既に存在するトピック（重複禁止・類似も避ける）
${exclusionList.slice(0, 60).join("\n")}

## 提案ルール
1. ranking_opportunity のKWを深掘りする記事を優先提案
2. high_impression_low_position のKWが狙える新記事を提案
3. proven_topic のKWの周辺・派生トピックを提案
4. 各トピックはSEOタイトル形式（30-40文字、検索意図を捉える）
5. **既存トピックと内容が重複・類似するものは絶対に含めない**
6. **切り口を多様化**: 手順系/税金系/相場系/状況別/比較系/失敗談系 などを散らす（同じ切り口で提案を埋めない）

## 出力形式（JSONのみ、説明なし）
{"topics": ["トピック1", "トピック2", ...]}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return [];

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.topics || [];
  } catch {
    return [];
  }
}

async function main() {
  console.log("Search Console からデータ取得中...");
  const rows = await getSearchConsoleData();
  console.log(`取得: ${rows.length}件のKW`);

  if (rows.length === 0) {
    console.log("データがまだありません。Search Consoleにデータが蓄積されるまで待ってください（通常2週間以上）");
    return;
  }

  const insights = classifyKeywords(rows);
  console.log(`分析: ${insights.length}件を分類`);

  // 分析結果を保存（確認用）
  const insightsPath = path.join(process.cwd(), "data/search-console-insights.json");
  if (!fs.existsSync(path.dirname(insightsPath))) {
    fs.mkdirSync(path.dirname(insightsPath), { recursive: true });
  }
  fs.writeFileSync(insightsPath, JSON.stringify(insights, null, 2), "utf-8");

  // 除外リスト: 既存記事タイトル + 既存トピックプール + 既存学習済みトピック
  const articlesDir = path.join(process.cwd(), "content/articles");
  const existingTitles: string[] = fs.existsSync(articlesDir)
    ? fs.readdirSync(articlesDir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => {
          const content = fs.readFileSync(path.join(articlesDir, f), "utf-8");
          const m = content.match(/title:\s*"(.+?)"/);
          return m ? m[1] : "";
        })
        .filter(Boolean)
    : [];

  const topicsPath = path.join(process.cwd(), "data/learned-topics.json");
  const existingLearned: string[] = fs.existsSync(topicsPath)
    ? JSON.parse(fs.readFileSync(topicsPath, "utf-8"))
    : [];

  const { siteConfig } = await import("../site.config");
  const exclusionList = [...existingTitles, ...existingLearned, ...siteConfig.articles.topicsPool];

  const newTopics = await generateRelatedTopics(insights, exclusionList);

  // 簡易重複フィルタ: タイトルの先頭10文字が既存と被るものを除外
  const dedupedNewTopics = newTopics.filter((nt) => {
    const prefix = nt.slice(0, 10);
    return !exclusionList.some((ex) => ex.slice(0, 10) === prefix);
  });

  console.log(`新規トピック提案: ${newTopics.length}件 → 重複除外後: ${dedupedNewTopics.length}件`);

  const merged = [...new Set([...dedupedNewTopics, ...existingLearned])].slice(0, 100);
  fs.writeFileSync(topicsPath, JSON.stringify(merged, null, 2), "utf-8");

  console.log(`学習済みトピック総数: ${merged.length}件`);
  newTopics.forEach((t) => console.log(`  + ${t}`));
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
