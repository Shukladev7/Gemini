import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { message } = req.body;
  if (!message || typeof message !== "string") return res.status(400).json({ error: "Missing or invalid 'message' in request body" });

  const API_KEY = process.env.GROQ_API_KEY;
  console.log("Groq key loaded:", API_KEY ? "Yes" : "No"); // 👈 Add this line here

  if (!API_KEY) return res.status(500).json({ error: "Missing GROQ_API_KEY" });

  try {
    const payload = {
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "You are 'CodeHelper', a coding assistant. Provide only working code with no comments. Give formatted answer." },
        { role: "user", content: message }
      ],
      temperature: 0.2,
      max_tokens: 1500
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: "Groq API error", details: data });

    const reply = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || null;
    if (!reply) return res.status(500).json({ error: "No reply from Groq", details: data });

    return res.status(200).json({ reply: reply.trim() });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
