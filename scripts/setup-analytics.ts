import "dotenv/config";
import { google } from "googleapis";

// GA4プロパティ + データストリーム + Search Console を自動セットアップ

const SITE_URL = "https://hojokin-support.net";
const PROPERTY_NAME = "補助金申請ナビ";

async function setup() {
  const saKey = JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY || "{}");

  // === GA4 プロパティ作成 ===
  console.log("GA4プロパティを作成中...");
  const authGA = new google.auth.GoogleAuth({
    credentials: saKey,
    scopes: ["https://www.googleapis.com/auth/analytics.edit"],
  });

  const analyticsadmin = google.analyticsadmin({ version: "v1beta", auth: authGA });

  // まずアカウント一覧を取得
  const accounts = await analyticsadmin.accounts.list();
  const account = accounts.data.accounts?.[0];
  if (!account?.name) {
    console.log("GA4アカウントが見つかりません。SAにGA4アカウントへのアクセス権が必要です。");
    console.log("GA4管理画面 → アカウントのアクセス管理 → SAメールを編集者で追加してください");
    return;
  }
  console.log(`GA4アカウント: ${account.displayName} (${account.name})`);

  // プロパティ作成
  const property = await analyticsadmin.properties.create({
    requestBody: {
      parent: account.name,
      displayName: PROPERTY_NAME,
      timeZone: "Asia/Tokyo",
      currencyCode: "JPY",
      industryCategory: "BUSINESS_AND_INDUSTRIAL_MARKETS",
    },
  });
  const propertyId = property.data.name; // "properties/123456789"
  console.log(`GA4プロパティ作成: ${propertyId}`);

  // データストリーム作成
  const stream = await analyticsadmin.properties.dataStreams.create({
    parent: propertyId!,
    requestBody: {
      type: "WEB_DATA_STREAM",
      displayName: PROPERTY_NAME,
      webStreamData: {
        defaultUri: SITE_URL,
      },
    },
  });
  const measurementId = stream.data.webStreamData?.measurementId;
  console.log(`測定ID: ${measurementId}`);
  console.log(`プロパティID: ${propertyId}`);

  // === Search Console 登録 ===
  console.log("\nSearch Consoleにサイト追加中...");
  const authSC = new google.auth.GoogleAuth({
    credentials: saKey,
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  });

  const webmasters = google.webmasters({ version: "v3", auth: authSC });

  try {
    await webmasters.sites.add({ siteUrl: SITE_URL });
    console.log(`Search Console追加: ${SITE_URL}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.log(`Search Console: ${msg}`);
  }

  // === 結果出力 ===
  console.log("\n=== セットアップ結果 ===");
  console.log(`GA4 測定ID: ${measurementId}`);
  console.log(`GA4 プロパティID: ${propertyId}`);
  console.log(`Search Console: ${SITE_URL}`);
  console.log("\n次のコマンドでGitHub Secrets/Vercelに設定してください:");
  console.log(`gh secret set GA4_PROPERTY_ID -R futakawa917-sketch/wensite-hojokin-navi -b "${propertyId}"`);
  console.log(`echo -n "${measurementId}" | vercel env add NEXT_PUBLIC_GA_ID production --yes`);
}

setup().catch((e) => {
  console.error("Error:", e.message);
});
