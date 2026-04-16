import "dotenv/config";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

// 新しい記事URLをGoogleに自動通知するスクリプト
// GitHub Actionsの記事生成後に実行

import { siteConfig } from "../site.config";
const SITE_URL = process.env.SITE_URL || siteConfig.url;

async function pingGoogle() {
  const saKey = process.env.GCP_SERVICE_ACCOUNT_KEY;
  if (!saKey) {
    console.log("GCP_SERVICE_ACCOUNT_KEY未設定。スキップ。");
    return;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(saKey),
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });

  const indexing = google.indexing({ version: "v3", auth });

  // 直近で追加された記事を検出（今日の日付のファイル）
  const articlesDir = path.join(process.cwd(), "content/articles");
  const today = new Date().toISOString().split("T")[0];
  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"));

  const newArticles = files.filter((f) => f.startsWith(today) || f.startsWith("pillar-"));

  // サイトマップも通知
  const urlsToNotify = [
    `${SITE_URL}/sitemap.xml`,
    ...newArticles.map((f) => `${SITE_URL}/articles/${f.replace(/\.md$/, "")}`),
  ];

  for (const url of urlsToNotify) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: {
          url,
          type: "URL_UPDATED",
        },
      });
      console.log(`✓ Notified: ${url}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "unknown";
      console.log(`✗ Failed: ${url} - ${msg}`);
    }
  }
}

pingGoogle().catch(console.error);
