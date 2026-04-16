# wensite テンプレート展開手順

このプロジェクトはテンプレート化されており、`site.config.ts` を書き換えるだけで別ジャンルのサイトが作れます。

## 新ジャンル展開の流れ

### 1. リポジトリをフォーク

```bash
# GitHub上で wensite リポジトリを新しい名前でフォーク
# 例: wensite-hojokin（補助金サイト）
# 例: wensite-reform（リフォームサイト）

gh repo fork futakawa917-sketch/wensite --clone --fork-name=wensite-hojokin
cd wensite-hojokin
```

### 2. site.config.ts を書き換え

書き換えるポイント：
- `name`: サイト名
- `description`: メタディスクリプション
- `url`: 本番URL（後で設定）
- `hero`: キャッチコピー
- `trustPoints`: 信頼要素（4つ）
- `reasons`: 選ばれる理由（5つ）
- `results`: 実績/事例（6つ）
- `testimonials`: お客様の声（3つ）
- `faq`: よくある質問（8つ）
- `articles.topicsPool`: 記事トピック（30本程度）
- `company`: 会社情報

### 3. 画像URLを差し替え

`site.config.ts` の以下の箇所を、そのジャンルに合った画像に変更：
- `heroImage`
- `staffImage`
- `worriesImage`
- `results[].image`（6つ）
- `testimonials[].photo`（3つ）

Unsplashで無料画像を検索: https://unsplash.com/s/photos/[キーワード]

### 4. AI診断の質問を調整

`src/app/diagnosis/page.tsx` の PROPERTY_TYPES, CONDITIONS を変更（不動産以外なら大幅変更）。
`src/app/api/diagnosis/route.ts` のプロンプトをジャンルに合わせて変更。

### 5. Vercelにデプロイ

```bash
vercel --prod --yes
```

初回デプロイ後、以下の環境変数を設定：

```bash
# Vercel Dashboardで設定
ANTHROPIC_API_KEY=sk-...
NEXT_PUBLIC_GA_ID=G-...
NEXT_PUBLIC_GSC_VERIFICATION=...
NEXT_PUBLIC_CLARITY_ID=...  # optional
LEADS_SHEET_ID=...
GCP_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### 6. GitHub Secretsを設定

```bash
gh secret set ANTHROPIC_API_KEY --body "sk-..."
gh secret set GA4_PROPERTY_ID --body "properties/..."
gh secret set GCP_SERVICE_ACCOUNT_KEY < /path/to/sa-key.json
```

### 7. Vercel Deployment Protection を無効化

https://vercel.com/[team]/[project]/settings/deployment-protection
→ Vercel Authentication → Disabled → Save

### 8. Google Search Console & GA4 登録

1. Search Console: 新サイトのURLを登録、HTMLタグで認証
2. GA4: 新プロパティ作成、計測ID取得
3. サービスアカウントをSearch Console + GA4に追加（閲覧/制限付き）
4. Google Sheetsでリード管理シート作成、SAに編集権限付与

### 9. サイトマップ送信

Search Console → サイトマップ → `sitemap.xml` を送信

---

## 展開候補ジャンル

- 補助金申請サポート
- リフォーム
- 外壁塗装
- 遺品整理
- 相続相談
- 太陽光発電
- エアコン工事
- 引越し業者
- リサイクル・買取

## サイト構築後の運用

| 頻度 | やること |
|------|---------|
| 毎日 | Google Sheetsでリード確認→対応 |
| 週1 | GA4・Search Consoleで流入確認 |
| 月1 | ラッコキーワードでKW調査→トピックプール追加 |

**自動化済みの処理**（手動不要）：
- 毎日3本の記事自動生成（GitHub Actions）
- 週1回のSearch Console/GA4学習（GitHub Actions）
- 月1回の不調記事リライト（GitHub Actions）
