import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { industry, employeeCount, annualRevenue, purpose, area } = body;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `あなたは補助金申請の専門コンサルタントAIです。以下の事業情報から、活用できる補助金の候補と受給可能性を診断してください。

## 事業情報
- 業種: ${industry}
- 従業員数: ${employeeCount}名
- 年間売上: ${annualRevenue}
- 補助金の使用目的: ${purpose}
- 事業所所在地: ${area}

## 診断ルール
- 2026年時点で公募中または近日公募予定の主要補助金から候補を選ぶ
- 事業規模・業種・目的に合った補助金を最大3つ提案
- 各補助金の受給可能性を高・中・低で評価
- 結果は以下のJSON形式で返答すること（JSON以外のテキストは一切出力しないでください）

\`\`\`json
{
  "subsidies": [
    {
      "name": "補助金名",
      "maxAmount": 最大補助額（万円、数値のみ）,
      "rate": "補助率（例: 2/3）",
      "probability": "高 or 中 or 低",
      "reason": "この補助金が合う理由（80文字以内）"
    }
  ],
  "totalPotential": 受給可能性のある合計金額（万円、数値のみ）,
  "factors": [診断のポイントを3つ、文字列の配列],
  "recommendation": "事業者へのアドバイス（100文字以内）"
}
\`\`\``,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "診断結果の解析に失敗しました" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "診断処理中にエラーが発生しました" }, { status: 500 });
  }
}
