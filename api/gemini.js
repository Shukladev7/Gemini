import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'message' in request body" });
  }

  try {
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are "CodeHelper", a coding assistant. Give code with no comments.Give answer in structured formated way. User question: ${message}`
            }
          ]
        }
      ]
    };

    const response = await fetch( "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + "AIzaSyBooQuwCLfTjrxrZSe9gCPcj558_8_9FP4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "Gemini API error", details: data });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.output?.[0]?.content?.parts?.[0]?.text ||
      null;

    if (!reply) {
      return res.status(500).json({ error: "No reply from Gemini", details: data });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
