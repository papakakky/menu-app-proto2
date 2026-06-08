import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { Menu } from '@/types';

export async function POST(req: Request) {
  let menu = null;
  try {
    const body = await req.json();
    menu = body.menu;

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Returning mock recipe data.");
      // モックデータにフォールバック
      const mockMenu: Menu = {
        ...menu,
        main: { ...menu.main, ingredients: ["豚肉 200g", "玉ねぎ 1/2個"], steps: ["切る", "炒める"] },
        side1: menu.side1 ? { ...menu.side1, ingredients: ["野菜 適量"], steps: ["和える"] } : undefined,
      };
      // ちょっとだけWaitを入れて演出
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ menu: mockMenu });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
あなたはプロの料理研究家です。
以下の料理名から、2人分の具体的な材料(ingredients)と調理手順(steps)を考えてJSON形式で返してください。
ポイント(point)はそのまま保持してください。

入力されたメニュー:
${JSON.stringify(menu, null, 2)}

以下のJSONフォーマットのみを返してください。
{
  "menu": {
    "main": { "name": "料理名", "ingredients": ["材料1", "材料2"], "steps": ["手順1", "手順2"] },
    "side1": { "name": "料理名", "ingredients": [], "steps": [] }, // 存在する場合のみ
    "side2": { "name": "料理名", "ingredients": [], "steps": [] }, // 存在する場合のみ
    "soup": { "name": "料理名", "ingredients": [], "steps": [] }, // 存在する場合のみ
    "point": "元のポイント文"
  }
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const textVal = response.text;
    const data = JSON.parse(textVal || "{}");
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Gemini API Error (Recipe):", error);
    // エラー時も入力値をそのまま返す（落ちないように）
    return NextResponse.json({ menu });
  }
}
