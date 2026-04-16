import "dotenv/config";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";

// GA4から人気記事を取得 → 関連トピックを派生 → learned-topics.jsonに追加
// 週1回 GitHub Actions で実行する想定

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || ""; // 例: "properties/123456789"
const LOOKBACK_DAYS = 28;

async function getTopPages() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY || "{}"),
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });

  const analyticsdata = google.analyticsdata({ version: "v1beta", auth });
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - LOOKBACK_DAYS);

  const res = await analyticsdata.properties.runReport({
    property: GA4_PROPERTY_ID,
    requestBody: {
      dateRanges: [{ startDate: start.toISOString().split("T")[0], endDate: end.toISOString().split("T")[0] }],
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
        { name: "engagementRate" },
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: "30",
    },
  });

  return res.data.rows || [];
}

interface PageInsight {
  path: string;
  title: string;
  views: number;
  avgDuration: number;
  engagementRate: number;
  performance: "high" | "medium" | "low";
}

function analyzePages(rows: Array<{ dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }>): PageInsight[] {
  return rows
    .filter((r) => r.dimensionValues?.[0]?.value?.startsWith("/articles/"))
    .map((r) => {
      const path = r.dimensionValues?.[0]?.value || "";
      const title = r.dimensionValues?.[1]?.value || "";
      const views = Number(r.metricValues?.[0]?.value || 0);
      const avgDuration = Number(r.metricValues?.[1]?.value || 0);
      const engagementRate = Number(r.metricValues?.[2]?.value || 0);

      let performance: PageInsight["performance"];
      if (views >= 50 && engagementRate >= 0.6) performance = "high";
      else if (views >= 10) performance = "medium";
      else performance = "low";

      return { path, title, views, avgDuration, engagementRate, performance };
    });
}

async function generateRelatedTopics(insights: PageInsight[], exclusionList: string[]): Promise<string[]> {
  const high = insights.filter((i) => i.performance === "high");
  if (high.length === 0) return [];

  const client = new Anthropic();
  const prompt = `以下はGA4から取得した、不動産買取サイトで反応が良い人気記事です。
これらの記事の周辺・派生トピックで、新規記事のアイデアを10本提案してください。

## 人気記事
${high.map((p) => `- ${p.title} / PV ${p.views} / 滞在 ${Math.round(p.avgDuration)}秒 / エンゲージ率 ${(p.engagementRate * 100).toFixed(0)}%`).join("\n")}

## 既に存在するトピック（重複禁止・類似も避ける）
${exclusionList.slice(0, 60).join("\n")}

## 提案ルール
1. 人気記事の同じテーマをさらに深掘り（ただし重複禁止）
2. 派生する関連質問・手続き・エッジケース
3. 組み合わせ読みされそうな補完トピック
4. SEOタイトル形式（30-40文字）
5. **既存トピックとの重複・類似は絶対に避ける**
6. **切り口の多様化**: 手順系/税金系/相場系/状況別/比較系/失敗談系 を散らす

## 出力（JSONのみ、説明なし）
{"topics": ["トピック1", ...]}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return [];

  try {
    return JSON.parse(jsonMatch[0]).topics || [];
  } catch {
    return [];
  }
}

async function main() {
  if (!GA4_PROPERTY_ID) {
    console.log("GA4_PROPERTY_ID が未設定です");
    return;
  }

  console.log("GA4からデータ取得中...");
  const rows = await getTopPages();
  console.log(`取得: ${rows.length}件のページ`);

  if (rows.length === 0) {
    console.log("データがまだありません。GA4にデータが蓄積されるまで待ってください。");
    return;
  }

  const insights = analyzePages(rows);
  const insightsPath = path.join(process.cwd(), "data/ga4-insights.json");
  if (!fs.existsSync(path.dirname(insightsPath))) {
    fs.mkdirSync(path.dirname(insightsPath), { recursive: true });
  }
  fs.writeFileSync(insightsPath, JSON.stringify(insights, null, 2), "utf-8");

  // 除外リスト: 既存記事タイトル + 既存トピックプール + 既存学習済み
  const articlesDir = path.join(process.cwd(), "content/articles");
  const existingTitles: string[] = fs.existsSync(articlesDir)
    ? fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md")).map((f) => {
        const c = fs.readFileSync(path.join(articlesDir, f), "utf-8");
        const m = c.match(/title:\s*"(.+?)"/);
        return m ? m[1] : "";
      }).filter(Boolean)
    : [];

  const topicsPath = path.join(process.cwd(), "data/learned-topics.json");
  const existingLearned: string[] = fs.existsSync(topicsPath)
    ? JSON.parse(fs.readFileSync(topicsPath, "utf-8"))
    : [];

  const { siteConfig } = await import("../site.config");
  const exclusionList = [...existingTitles, ...existingLearned, ...siteConfig.articles.topicsPool];

  const newTopics = await generateRelatedTopics(insights, exclusionList);

  const dedupedNewTopics = newTopics.filter((nt) => {
    const prefix = nt.slice(0, 10);
    return !exclusionList.some((ex) => ex.slice(0, 10) === prefix);
  });

  console.log(`新規派生トピック: ${newTopics.length}件 → 重複除外後: ${dedupedNewTopics.length}件`);

  const merged = [...new Set([...dedupedNewTopics, ...existingLearned])].slice(0, 100);
  fs.writeFileSync(topicsPath, JSON.stringify(merged, null, 2), "utf-8");

  console.log(`学習済みトピック総数: ${merged.length}件`);
  newTopics.forEach((t) => console.log(`  + ${t}`));
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
