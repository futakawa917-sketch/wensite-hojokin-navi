import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { siteConfig } from "../site.config";

const client = new Anthropic();

// 記事内で使うUnsplash画像（不動産テーマ別）
const ARTICLE_IMAGES: Record<string, string[]> = {
  general: [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    "https://images.unsplash.com/photo-1582407947092-5e21e1f8b40a?w=800&q=80",
  ],
  house: [
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80",
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
  ],
  apartment: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  ],
  money: [
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848e968838?w=800&q=80",
    "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=800&q=80",
  ],
  document: [
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848e968838?w=800&q=80",
    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
  ],
  oldhouse: [
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&q=80",
  ],
};

function selectImages(topic: string): string[] {
  const lower = topic.toLowerCase();
  if (lower.includes("マンション")) return ARTICLE_IMAGES.apartment;
  if (lower.includes("税") || lower.includes("費用") || lower.includes("手数料") || lower.includes("控除")) return ARTICLE_IMAGES.money;
  if (lower.includes("書類") || lower.includes("確定申告") || lower.includes("契約")) return ARTICLE_IMAGES.document;
  if (lower.includes("古い") || lower.includes("空き家") || lower.includes("築")) return ARTICLE_IMAGES.oldhouse;
  if (lower.includes("戸建") || lower.includes("家")) return ARTICLE_IMAGES.house;
  return ARTICLE_IMAGES.general;
}

async function generateArticle() {
  const articlesDir = path.join(process.cwd(), "content/articles");
  const existingFiles = fs.existsSync(articlesDir)
    ? fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"))
    : [];

  const existingArticles = existingFiles.map((f) => {
    const content = fs.readFileSync(path.join(articlesDir, f), "utf-8");
    const titleMatch = content.match(/title:\s*"(.+?)"/);
    const slugMatch = f.replace(/\.md$/, "");
    return { title: titleMatch ? titleMatch[1] : "", slug: slugMatch };
  });

  const existingTitles = existingArticles.map((a) => a.title);

  // 学習済みトピック（Search Console由来）を優先し、その後に固定プールを使用
  const learnedTopicsPath = path.join(process.cwd(), "data/learned-topics.json");
  const learnedTopics: string[] = fs.existsSync(learnedTopicsPath)
    ? JSON.parse(fs.readFileSync(learnedTopicsPath, "utf-8"))
    : [];

  const allTopics = [...learnedTopics, ...siteConfig.articles.topicsPool];
  const unusedTopics = allTopics.filter(
    (t) => !existingTitles.some((et) => et.includes(t.split("｜")[0].split("【")[0]))
  );

  // ランダムに1本選ぶ（選択の多様性確保）
  const pickIndex = Math.floor(Math.random() * Math.min(unusedTopics.length, 10));
  const pickedTopic = unusedTopics[pickIndex];

  const topicInstruction =
    unusedTopics.length > 0
      ? `以下のトピックで記事を書いてください:\n「${pickedTopic}」`
      : `不動産買取に関する新しいロングテールキーワードを狙った記事を書いてください。以下は既に書かれたトピックなので避けてください:\n${existingTitles.join("\n")}`;

  const diversityInstruction = `\n## 多様性ルール（重要・厳守）
既存記事と**切り口・構成・事例を明確に変えてください**。以下の既存タイトルを読み、重複しない独自の角度で書いてください:
${existingTitles.slice(0, 20).join("\n")}
- 既存記事と同じ構成（例: ステップ列挙のみ、税金解説のみ）にしない
- 既存記事で使われた事例・体験談と被る内容を避ける
- 可能なら、既存にない切り口（失敗談/比較/チェックリスト/Q&A形式など）を取り入れる`;

  const internalLinks =
    existingArticles.length > 0
      ? `\n## 内部リンク挿入指示\n記事内の関連箇所に以下の既存記事へのリンクを2〜3本自然に挿入:\n${existingArticles
          .slice(0, 10)
          .map((a) => `- [${a.title}](/articles/${a.slug})`)
          .join("\n")}`
      : "";

  // トピックに合った画像を選択
  const topic = pickedTopic || "不動産買取";
  const images = selectImages(topic);

  const today = new Date().toISOString().split("T")[0];

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 16384,
    messages: [
      {
        role: "user",
        content: `あなたはSEO・Webマーケティングのプロであり、不動産買取業界に精通した専門家です。
読者を惹きつけ、Googleで上位表示され、最終的に買取査定の問い合わせにつながる高品質な記事を書いてください。

${topicInstruction}

## 出力フォーマット（厳守）

---
title: "記事タイトル"
description: "メタディスクリプション（120文字以内）"
date: "${today}"
keywords: ["キーワード1", "キーワード2", "キーワード3"]
---

（ここに本文）

## 記事の構成ルール（厳守）

### 全体構成
1. **アイキャッチ画像**: 記事冒頭に以下の画像を挿入
   ![記事のイメージ](${images[0]})

2. **リード文**（200〜300文字）: 読者の悩みに共感 → この記事で何が解決できるか → 読む価値を示す

3. **目次風セクション**: 記事の要点を箇条書きで3〜5個（太字で）

4. **本文**（h2を6〜8個）: 各セクションに具体例・数字・比較表を入れる

5. **途中画像**: 記事の中盤あたりで以下の画像を挿入
   ![イメージ画像](${images[1]})

6. **まとめセクション**: 要点を箇条書きで整理

7. **末尾画像**: まとめの前後に以下の画像を挿入
   ![イメージ画像](${images[2]})

### 本文の品質ルール

**ボリューム**: 4000〜5000文字

**図解・表の挿入（必須）**:
- 比較表を最低1つ入れる（例: 仲介vs買取、メリットvsデメリット）
- チェックリストや箇条書きを積極的に使う
- 数字は太字にする（例: **約3,000万円**）

**具体例（必須）**:
- 「Aさん（50代・東京都在住）のケース」のような架空の体験談を1〜2個入れる
- 具体的な金額・期間を含める
- 体験談は引用ブロック（>）で囲む

**E-E-A-T表現**:
- 「不動産買取の現場では〜」「多くのお客様を見てきた経験から〜」
- 法律・税金の話は根拠（法律名・年度）を示す
- 「2026年時点では〜」と時期を明記

**CTA挿入**:
- 中盤に1回: 「まずはAI買取診断で概算価格を確認してみませんか？→ [AI買取診断はこちら](/diagnosis)」
- 末尾に1回: 「当社では、無料で買取査定を行っています。→ [無料査定はこちら](/contact)」

**文体**:
- です/ます調
- 「〜です。〜です。」の連続禁止。「〜でしょう」「〜ません」「〜ください」等バリエーションをつける
- 専門用語は初出時に説明
- 1文は60文字以内を目安に。長文は分割する

### SEOルール
- タイトル: 30〜40文字、メインKWを先頭に
- 見出し: キーワードバリエーションを含む。見出しだけで内容がわかるように
- メタディスクリプション: 120文字以内。読者のベネフィットを示す
${internalLinks}
${diversityInstruction}

### 禁止事項
- 「いかがでしたでしょうか」等のAI定型表現
- 根拠のない数字
- 見出しに「はじめに」「おわりに」
- 内容が薄い・一般的すぎるセクション`,
      },
    ],
  });

  const content =
    message.content[0].type === "text" ? message.content[0].text : "";

  const titleMatch = content.match(/title:\s*"(.+?)"/);
  const title = titleMatch ? titleMatch[1] : `article-${Date.now()}`;

  // ASCII-only slug (Japanese characters cause 404 on Vercel)
  // Use date + sequential number based on existing files
  const todayPrefix = today;
  const sameDayCount = existingFiles.filter((f) => f.startsWith(todayPrefix)).length;
  const slug = `${today}-${String(sameDayCount + 1).padStart(2, "0")}`;

  const filename = `${slug}.md`;
  const filePath = path.join(articlesDir, filename);

  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true });
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Article generated: ${filename}`);
  console.log(`Title: ${title}`);
  console.log(`Words: ~${content.length} chars`);
}

generateArticle().catch(console.error);
