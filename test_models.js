const { GoogleGenAI } = require('@google/genai');
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function testModel(modelName) {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: 'Hello',
    });
    console.log(`[SUCCESS] ${modelName}:`, response.text.substring(0, 20));
  } catch (err) {
    console.log(`[ERROR] ${modelName}:`, err.message.substring(0, 100));
  }
}

async function main() {
  const models = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.5-pro',
    'gemini-pro',
    'gemini-flash-latest'
  ];
  for (const m of models) {
    await testModel(m);
  }
}
main();
