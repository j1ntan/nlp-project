import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

if (!API_KEY) {
  throw new Error("❌ API key not found. Make sure VITE_OPENROUTER_API_KEY is set in your .env file.");
}

export async function generateQuestionsFromAI(
  chapter: string,
  oneMark: number,
  twoMark: number
): Promise<string[]> {
  const prompt = `
Generate ${twoMark} questions of 2 marks and ${oneMark} questions of 1 mark from the following content:

"""${chapter}"""
`;

  const payload = {
    model: "mistralai/mistral-7b-instruct", // ✅ corrected model ID
    messages: [{ role: "user", content: prompt }],
  };

  console.log("✅ Sending to OpenRouter:", payload);

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      payload,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", // required by OpenRouter
          "X-Title": "AI Question Generator",
        },
      }
    );

    const raw = response.data.choices[0].message.content;
    const questions = raw
      .split("\n")
      .map((q: string) => q.trim())
      .filter((q: string) => q.length > 0);

    return questions;
  } catch (err: any) {
    console.error("❌ Error from OpenRouter:", err.response?.data || err.message);
    throw new Error(`API request failed: ${err.message}`);
  }
}
