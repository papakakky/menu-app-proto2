import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const MOCK_MENU = {
  id: "chat_m1",
  title: "初夏を感じる豚の生姜焼き献立",
  main: { name: "新生姜を使った豚の生姜焼き", ingredients: ["豚肉 200g", "新生姜 1片", "醤油 大さじ1", "みりん 大さじ1"], steps: ["豚肉を炒め、新生姜と調味料を絡める"] },
  side1: { name: "トマトと大葉のポン酢和え", ingredients: ["トマト 1個", "大葉 2枚", "ポン酢 大さじ1"], steps: ["トマトを切り、大葉とポン酢で和える"] },
  soup: { name: "茄子とミョウガのお味噌汁", ingredients: ["茄子 1/2本", "ミョウガ 1個", "味噌 大さじ1"], steps: ["茄子を炒めてから、だし汁と味噌を加え、ミョウガをのせる"] },
  point: "ご指定の条件を踏まえ、季節の野菜を組み合わせてシズル感を出しました！"
};

export async function POST(req: Request) {
  try {
    const { message, baseMenu } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        reply: `「${message}」ですね！承知しました。以下の献立はいかがでしょうか？`,
        menu: MOCK_MENU
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
あなたはプロの献立コンシェルジュです。
ユーザーが現在の献立案を手直ししようとしています。
元の献立: ${JSON.stringify(baseMenu)}
ユーザーの要望: ${message}

要望を踏まえて、新しい1つの献立を提案してください。
以下のJSONフォーマットで返してください。それ以外のテキストは含めないでください。
{
  "reply": "ユーザーへの対話的な返答メッセージ（例：ご指定の食材で季節感を出してみました！）",
  "menu": {
    "id": "一意のID",
    "title": "献立のタイトル",
    "main": { "name": "料理名", "ingredients": ["材料1", "材料2"], "steps": ["手順1", "手順2"] },
    "side1": { "name": "料理名", "ingredients": [], "steps": [] },
    "side2": { "name": "料理名", "ingredients": [], "steps": [] },
    "soup": { "name": "料理名", "ingredients": [], "steps": [] },
    "point": "工夫のポイント"
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
      menu: MOCK_MENU
    });
  }
}
