require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function test(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("hello");
    console.log(modelName, "SUCCESS");
  } catch(e) { console.error(modelName, "FAILED:", e.message) }
}
async function run() {
  await test('gemini-2.5-flash');
  await test('gemini-flash-latest');
}
run();
