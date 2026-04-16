import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { siteConfig } from "../site.config";

// 最新記事からnote/SNS用の要約記事を自動生成
// 週1回 GitHub Actions で実行 → marketing/drafts/ に保存

const client = new Anthropic();

async function generateDrafts() {
  const articlesDir = path.join(process.cwd(), "content/articles");
  const draftsDir = path.join(process.cwd(), "marketing/drafts");
  if (!fs.existsSync(draftsDir)) fs.mkdirSync(draftsDir, { recursive: true });

  // 直近7日の記事を取得
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"));

  const recentArticles = files
    .map((f) => {
      const content = fs.readFileSync(path.join(articlesDir, f), "utf-8");
      const titleMatch = content.match(/title:\s*"(.+?)"/);
      const descMatch = content.match(/description:\s*"(.+?)"/);
      const dateMatch = content.match(/date:\s*"(.+?)"/);
      return {
        slug: f.replace(/\.md$/, ""),
        title: titleMatch?.[1] || "",
        description: descMatch?.[1] || "",
        date: dateMatch?.[1] || "",
        content,
      };
    })
    .filter((a) => new Date(a.date) >= weekAgo)
    .slice(0, 5);

  if (recentArticles.length === 0) {
    console.log("直近7日の新規記事がありません");
    return;
  }

  console.log(`${recentArticles.length}本の記事からnote用ドラフトを生成...`);

  // note用まとめ記事を生成
  const articleList = recentArticles
    .map((a) => `- ${a.title}\n  URL: ${siteConfig.url}/articles/${a.slug}`)
    .join("\n");

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `以下の補助金関連の記事から、noteに投稿する「今週の補助金コラムまとめ」記事を書いてください。

## 今週公開された記事
${articleList}

## ルール
- タイトル: 「【今週の補助金コラム】〇〇〇〇（キャッチーな要約）」
- 冒頭: 挨拶 + 「補助金HACKの二川です」
- 各記事を2〜3行で要約し、リンクを貼る
- 末尾に以下を必ず入れる:

---
補助金のことでお悩みなら、LINEで無料診断を行っています。
▶ LINE無料診断: ${siteConfig.cta.lineUrl}
▶ 補助金HACK: ${siteConfig.url}

株式会社SNS HACK 二川 凌

- 全体で800〜1200文字
- 本文のみ出力（説明不要）`,
      },
    ],
  });

  const noteContent = message.content[0].type === "text" ? message.content[0].text : "";
  const today = new Date().toISOString().split("T")[0];
  const notePath = path.join(draftsDir, `note-${today}.md`);
  fs.writeFileSync(notePath, noteContent, "utf-8");
  console.log(`note用ドラフト生成: ${notePath}`);

  // GBP投稿用テキスト生成（短文）
  for (const article of recentArticles.slice(0, 3)) {
    const gbpMessage = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `以下の記事の内容を、Googleビジネスプロフィールの投稿用に100文字以内で要約してください。最後に「詳しくはこちら→」を付けてください。本文のみ出力。

タイトル: ${article.title}
説明: ${article.description}`,
        },
      ],
    });
    const gbpText = gbpMessage.content[0].type === "text" ? gbpMessage.content[0].text : "";
    const gbpPath = path.join(draftsDir, `gbp-${today}-${article.slug.slice(-2)}.txt`);
    const gbpContent = `${gbpText}\n\n詳しくはこちら→ ${siteConfig.url}/articles/${article.slug}`;
    fs.writeFileSync(gbpPath, gbpContent, "utf-8");
    console.log(`GBP投稿用ドラフト: ${gbpPath}`);
  }
}

generateDrafts().catch(console.error);
