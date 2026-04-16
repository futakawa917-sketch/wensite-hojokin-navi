#!/bin/bash
# 新規サイトセットアップスクリプト
# フォーク後に1回だけ実行する

set -e

echo "=== wensite 新規サイトセットアップ ==="
echo ""

# 1. site.config.ts の TODO_REPLACE チェック
TODO_COUNT=$(grep -c "TODO_REPLACE" site.config.ts 2>/dev/null || echo "0")
echo "site.config.ts に ${TODO_COUNT} 箇所の書き換え必須箇所があります。"
echo ""

# 2. 対話式で基本情報を入力
read -p "サイト名（例: 補助金サポートナビ）: " SITE_NAME
read -p "サイトURL（例: https://hojokin-navi.vercel.app）: " SITE_URL
read -p "会社名: " COMPANY_NAME
read -p "電話番号: " PHONE
read -p "メールアドレス: " EMAIL

echo ""
echo "=== 入力内容 ==="
echo "サイト名: $SITE_NAME"
echo "URL: $SITE_URL"
echo "会社名: $COMPANY_NAME"
echo "電話番号: $PHONE"
echo "メール: $EMAIL"
echo ""
read -p "この内容でsite.config.tsを更新しますか？ (y/N): " CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "キャンセルしました。site.config.ts を手動で編集してください。"
  exit 0
fi

# 3. site.config.ts の基本情報を置換
if [[ "$OSTYPE" == "darwin"* ]]; then
  SED_CMD="sed -i ''"
else
  SED_CMD="sed -i"
fi

$SED_CMD "s|url: \"https://wensite-chi.vercel.app\"|url: \"$SITE_URL\"|" site.config.ts
$SED_CMD "s|phone: \"0120-000-0000\"|phone: \"$PHONE\"|g" site.config.ts
$SED_CMD "s|email: \"info@example.com\"|email: \"$EMAIL\"|g" site.config.ts

echo ""
echo "=== 基本情報を更新しました ==="
echo ""
echo "次のステップ:"
echo "  1. site.config.ts を開いて業界固有のコンテンツを編集"
echo "     (お客様の声、記事トピック、FAQ、実績 等)"
echo "     grep 'TODO_REPLACE' site.config.ts で残りを確認"
echo ""
echo "  2. GitHub Secrets を設定:"
echo "     - ANTHROPIC_API_KEY"
echo "     - GCP_SERVICE_ACCOUNT_KEY"
echo "     - LEADS_SHEET_ID"
echo "     - GA4_PROPERTY_ID（任意）"
echo ""
echo "  3. Vercel にデプロイ:"
echo "     vercel --prod"
echo ""
echo "  4. 既存の記事を削除（不動産のサンプル記事）:"
echo "     rm -rf content/articles/*"
echo "     rm -f data/learned-topics.json data/search-console-insights.json"
echo ""
