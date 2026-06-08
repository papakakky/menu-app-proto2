import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { imagePrompt } = await req.json();

    const promptText = (imagePrompt || "").toLowerCase();
    
    let imageUrl = "/images/cafe.png"; // Default

    // 簡単なキーワードマッチングで画像を切り替える（プロトタイプ用）
    if (promptText.includes("和") || promptText.includes("japanese") || promptText.includes("fish") || promptText.includes("miso")) {
      imageUrl = "/images/japanese.png";
    } else if (promptText.includes("洋") || promptText.includes("western") || promptText.includes("steak") || promptText.includes("pasta") || promptText.includes("bread")) {
      imageUrl = "/images/western.png";
    } else if (promptText.includes("中華") || promptText.includes("chinese") || promptText.includes("fried") || promptText.includes("dumpling") || promptText.includes("ガッツリ") || promptText.includes("肉")) {
      imageUrl = "/images/chinese.png";
    } else {
      // カフェ風、ヘルシー、その他
      imageUrl = "/images/cafe.png";
    }

    // すぐに返すと速すぎるため、AIが考えている感を出すために少しだけWait（演出用）
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error("Imagen Mock API Error:", error);
    return NextResponse.json({ imageUrl: "/images/cafe.png" });
  }
}
