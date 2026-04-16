import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

// リードをGoogle Sheetsに記録するエンドポイント

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, propertyType, area, message, source } = body;

    if (!name || !phone || !propertyType || !area) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }

    const sheetId = process.env.LEADS_SHEET_ID;
    const saKey = process.env.GCP_SERVICE_ACCOUNT_KEY;

    if (!sheetId || !saKey) {
      console.error("LEADS_SHEET_ID or GCP_SERVICE_ACCOUNT_KEY not set");
      return NextResponse.json({ error: "サーバー設定エラー" }, { status: 500 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(saKey),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const timestamp = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
    const row = [
      timestamp,
      name || "",
      phone || "",
      email || "",
      propertyType || "",
      area || "",
      message || "",
      source || "direct",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:H",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "unknown error";
    console.error("Contact API error:", msg);
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}
