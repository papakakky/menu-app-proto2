import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { ThemeProposal } from '@/types';

const MOCK_THEME: ThemeProposal = {
  id: "chat_t1",
  themeTitle: "アレンジ完了！冷蔵庫の余り物で絶品中華",
  themeDescription: "ご要望通り、えのきを追加してボリュームアップしました！",
  imagePrompt: "A cozy, warm watercolor illustration of a Chinese-style dinner table. The main dish is a stir-fry including enoki mushrooms. Drawn in a lifestyle magazine style. NO TEXT.",
  menu: {
    main: { name: "えのきと豚肉のオイスター炒め" },
    side1: { name: "もやしのナムル" },
    soup: { name: "わかめスープ" },
    point: "えのきでかさ増しして大満足の一品です！"
  }
};

export async function POST(req: Request) {
  try {
    const { message, baseTheme } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        reply: `「${message}」ですね！承知しました。以下の献立はいかがでしょうか？`,
        theme: MOCK_THEME
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
あなたは雑誌『dancyu』や『オレンジページ』の敏腕編集者兼AIシェフです。
ユーザーが現在の献立テーマを手直ししようとしています。
元のテーマと献立: ${JSON.stringify(baseTheme)}
ユーザーの要望: ${message}

要望を踏まえて、新しい1つのテーマと献立を提案してください。
以下のトーン＆マナーを厳格に守ってください。
・単なる料理名や条件の羅列はNG。
・読んだ瞬間に食欲をそそり、情景やストーリーが浮かぶ魅力的なキャッチコピー（themeTitle）をつけること。
・imagePromptは、指定された料理が並んだ食卓の様子を描写する英語のプロンプトにしてください。末尾には必ず以下を追加：
  "drawn in a warm, cozy watercolor style, like a lifestyle magazine illustration, showing a dining table with the dishes. NO TEXT."

以下のJSONフォーマットで返してください。それ以外のテキストは含めないでください。
{
  "reply": "ユーザーへの対話的な返答メッセージ（例：ご指定の食材でアレンジしました！）",
  "theme": {
    "id": "一意のID",
    "themeTitle": "魅力的なキャッチコピー（テーマ）",
    "themeDescription": "このテーマの情景や選んだ理由の説明",
    "imagePrompt": "英語の画像生成用プロンプト",
    "menu": {
      "main": { "name": "料理名" },
      "side1": { "name": "料理名" },
      "side2": { "name": "料理名" },
      "soup": { "name": "料理名" },
      "point": "工夫のポイント"
    }
  }
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const textVal = response.text;
    const data = JSON.parse(textVal || "{}");
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({
      reply: "申し訳ありません、エラーが発生しました。代わりの献立をご提案します。",
      theme: MOCK_THEME
    });
  }
}
