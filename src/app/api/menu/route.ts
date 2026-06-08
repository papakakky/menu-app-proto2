import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { ThemeProposal } from '@/types';

// モック用のデータ（APIキーがない場合やエラー時のフォールバック）
const MOCK_THEMES: ThemeProposal[] = [
  {
    id: "t1",
    themeTitle: "初夏を乗り切る！さっぱり和風の夕涼み御膳",
    themeDescription: "蒸し暑い日の終わりに、お酢の力と旬の野菜で身体を労る優しい和食のセットです。縁側で涼みながら食べたくなるような、涼やかな食卓をイメージしました。",
    imagePrompt: "A beautiful top-down view of a Japanese dinner table in early summer. The main dish is fried horse mackerel marinated in vinegar with colorful sliced vegetables. Side dishes include spinach dressed with sesame sauce, and tofu wakame miso soup. A cold glass of barley tea is on the side. Drawn in a warm, cozy watercolor style, like a lifestyle magazine illustration, showing a dining table with the dishes. NO TEXT.",
    menu: {
      main: { name: "アジの南蛮漬け" },
      side1: { name: "ほうれん草の胡麻和え" },
      soup: { name: "豆腐とわかめの味噌汁" },
      point: "お魚の旨味とお酢の酸味で疲労回復！野菜もたっぷりとれる一品です。"
    }
  },
  {
    id: "t2",
    themeTitle: "ガッツリ食べて明日へチャージ！スタミナ満点食堂",
    themeDescription: "しっかり食べたい夜にぴったりの、ご飯が進む生姜焼き定食。新生姜の爽やかな香りと、夏野菜を使った副菜が食欲をそそります。",
    imagePrompt: "A mouth-watering view of a hearty Japanese set meal. The main dish is ginger pork on a plate with shredded cabbage. Side dishes include tomato and shiso salad, and okra with plum paste. Eggplant miso soup and a bowl of white rice complete the meal. Drawn in a warm, cozy watercolor style, like a lifestyle magazine illustration, showing a dining table with the dishes. NO TEXT.",
    menu: {
      main: { name: "豚の生姜焼き" },
      side1: { name: "トマトと大葉のポン酢和え" },
      side2: { name: "オクラと長芋の梅肉和え" },
      soup: { name: "茄子とミョウガのお味噌汁" },
      point: "新生姜を使うのがポイント！マイルドな辛味と爽やかな香りで食欲がアップします。"
    }
  },
  {
    id: "t3",
    themeTitle: "休日の夜はサクッと済ませてダラダラしよう！アジアン屋台飯",
    themeDescription: "作る手間は最小限に、でもいつもと違う気分を味わいたい夜に。フライパン一つで完成する具沢山なネギ塩焼きそばとナムルのセット。",
    imagePrompt: "A fun and casual dinner setting featuring an Asian-style street food vibe. A large plate of savory salt-fried noodles with pork and lots of green onions, accompanied by a small bowl of bean sprout namul. A cold beer or sparkling water is next to it. Drawn in a warm, cozy watercolor style, like a lifestyle magazine illustration, showing a dining table with the dishes. NO TEXT.",
    menu: {
      main: { name: "具沢山ネギ塩焼きそば" },
      side1: { name: "もやしのナムル" },
      point: "塩味がきいた焼きそばに、ごま油香るナムルで中華風の定食に。"
    }
  }
];

export async function POST(req: Request) {
  try {
    const { time, month, dayOfWeek } = await req.json();
    
    // APIキーが設定されていない場合はモックを返す
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Returning mock data.");
      MOCK_THEMES[0].themeTitle = "エラー: APIキーがVercelに設定されていません";
      return NextResponse.json({ themes: MOCK_THEMES });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    

    const prompt = `
あなたは雑誌『dancyu』や『オレンジページ』の敏腕編集者兼AIシェフです。
現在のコンテキスト（時刻: ${time}, 季節/月: ${month}月, 曜日: ${dayOfWeek}曜日）に基づいて、読者（ユーザー）の気分にぴったりな「食卓のワクワク感を提案する」3つの献立テーマを作成してください。
同じテーマばかりにならないよう、ジャンル（和・洋・中・エスニックなど）や切り口をバラバラにしてください。

以下のトーン＆マナーを厳格に守ってください。
・単なる料理名や条件の羅列はNG。
・読んだ瞬間に食欲をそそり、情景やストーリーが浮かぶ魅力的なキャッチコピー（themeTitle）をつけること。ただし【最大25文字以内】で短く簡潔にしてください。
・テーマごとの情景や選んだ理由の説明文（themeDescription）は【80〜100文字程度】で、少し長めにしっかりと魅力を語ってください。
・メニューは主菜1品、副菜1〜2品、汁物1品（必要に応じて）の構成としてください。

以下のJSONフォーマットで返してください。それ以外のテキストは含めないでください。
{
  "themes": [
    {
      "id": "ユニークなID",
      "themeTitle": "魅力的なキャッチコピー（テーマ）",
      "themeDescription": "このテーマの情景や選んだ理由の説明",
      "imagePrompt": "",
      "menu": {
        "main": { "name": "料理名" },
        "side1": { "name": "料理名" },
        "side2": { "name": "料理名" }, // 省略可
        "soup": { "name": "料理名" }, // 省略可
        "point": "この献立のシズル感あるポイントや工夫の解説"
      }
    }
  ]
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
    
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // エラー時もとりあえずモックを返してアプリが落ちないようにする
    MOCK_THEMES[0].themeTitle = "APIエラー: " + (error.message || "タイムアウト等の不明なエラー");
    return NextResponse.json({ themes: MOCK_THEMES });
  }
}
