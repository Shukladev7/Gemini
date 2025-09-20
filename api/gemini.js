// api/gemini.js
// Vercel serverless function for Gemini proxy

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    // Build prompt (you can enhance this)
    const prompt = `You are Kshyap, a helpful multilingual assistant. 
Respond in ${language}. 
User: ${message}`;

    const apiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        "AIzaSyBooQuwCLfTjrxrZSe9gCPcj558_8_9FP4",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!apiRes.ok) {
      const errTxt = await apiRes.text();
      return res
        .status(apiRes.status)
        .json({ error: "Gemini error", details: errTxt });
    }

    const data = await apiRes.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, no reply from Gemini.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
