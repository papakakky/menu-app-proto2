import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// モック用のデータ（APIキーがない場合やエラー時のフォールバック）
const MOCK_MENUS = [
  {
    id: "m1",
    title: "さっぱりお魚メインの和食献立",
    main: { name: "アジの南蛮漬け", ingredients: ["アジ 2尾", "玉ねぎ 1/2個", "ピーマン 1個", "にんじん 1/3本", "酢 大さじ3"], steps: ["野菜を千切りにする", "アジに片栗粉をまぶし、多めの油で揚げるように焼く", "調味料と野菜を合わせ、焼いたアジを漬け込む"] },
    side1: { name: "ほうれん草の胡麻和え", ingredients: ["ほうれん草 1/2束", "すりごま 大さじ1", "醤油 小さじ1"], steps: ["ほうれん草を茹でて水気を絞り、切る", "調味料と和える"] },
    soup: { name: "豆腐とわかめの味噌汁", ingredients: ["豆腐 1/4丁", "乾燥わかめ ひとつまみ", "味噌 大さじ1"], steps: ["だし汁を温め、具材を入れる", "火を止めて味噌を溶き入れる"] },
    point: "お魚の旨味とお酢の酸味で疲労回復！野菜もたっぷりとれる一品です。"
  },
  {
    id: "m2",
    title: "ご飯が進む定番のお肉献立",
    main: { name: "豚の生姜焼き", ingredients: ["豚薄切り肉 200g", "玉ねぎ 1/2個", "生姜 1片", "醤油 大さじ1.5"], steps: ["玉ねぎをスライスし、生姜はすりおろす", "フライパンで豚肉と玉ねぎを炒める", "調味料を絡める"] },
    side1: { name: "トマトと大葉のポン酢和え", ingredients: ["トマト 1個", "大葉 2枚", "ポン酢 大さじ1"], steps: ["トマトをくし切りにし、大葉をちぎる", "ポン酢で和える"] },
    side2: { name: "オクラと長芋の梅肉和え", ingredients: ["オクラ 4本", "長芋 5cm", "梅干し 1個"], steps: ["オクラを茹でて刻む", "長芋を短冊切りにし、叩いた梅肉と和える"] },
    soup: { name: "茄子とミョウガのお味噌汁", ingredients: ["茄子 1/2本", "ミョウガ 1個", "味噌 大さじ1"], steps: ["茄子をごま油で炒める", "だし汁を加え、味噌とミョウガを入れる"] },
    point: "新生姜を使うのがポイント！マイルドな辛味と爽やかな香りで食欲がアップします。"
  },
  {
    id: "m3",
    title: "本格派の麺類献立",
    main: { name: "具沢山ネギ塩焼きそば", ingredients: ["焼きそば麺 2玉", "豚バラ肉 100g", "キャベツ 2枚", "長ネギ 1/2本", "鶏ガラスープの素 小さじ1"], steps: ["具材を適当な大きさに切る", "豚肉、野菜、麺の順に炒める", "調味料で味を整える"] },
    side1: { name: "もやしのナムル", ingredients: ["もやし 1/2袋", "ごま油 小さじ1", "塩 少々"], steps: ["もやしをレンジで加熱し、水気を絞る", "ごま油と塩で和える"] },
    point: "塩味がきいた焼きそばに、ごま油香るナムルで中華風の定食に。"
  }
];

export async function POST(req: Request) {
  try {
    const { context } = await req.json();
    
    // APIキーが設定されていない場合はモックを返す（プロトタイプが動くようにする）
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Returning mock data.");
      return NextResponse.json({ menus: MOCK_MENUS });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
あなたはプロの献立コンシェルジュです。
ユーザーからの要望（${context || '今日の夕飯、おまかせ'}）に基づいて、3つの献立案を作成してください。

以下のJSONフォーマットで返してください。それ以外のテキストは含めないでください。
{
  "menus": [
    {
      "id": "ユニークなID",
      "title": "献立のキャッチーなタイトル",
      "main": { "name": "料理名", "ingredients": ["材料1", "材料2"], "steps": ["手順1", "手順2"] },
      "side1": { "name": "料理名", "ingredients": [], "steps": [] },
      "side2": { "name": "料理名", "ingredients": [], "steps": [] }, // 省略可
      "soup": { "name": "料理名", "ingredients": [], "steps": [] }, // 省略可
      "point": "この献立のシズル感あるポイントや工夫の解説"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const textVal = response.text;
    const data = JSON.parse(textVal || "{}");
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    // エラー時もとりあえずモックを返してアプリが落ちないようにする
    return NextResponse.json({ menus: MOCK_MENUS });
  }
}
