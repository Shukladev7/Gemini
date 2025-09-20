import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, language } = req.body;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        "AIzaSyBooQuwCLfTjrxrZSe9gCPcj558_8_9FP4",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply" });
    } else {
      res.status(500).json({ error: "Gemini error", details: data });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}
