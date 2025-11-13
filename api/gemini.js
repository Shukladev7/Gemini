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
      model: "gpt-4o-mini", // you can also use "gpt-3.5-turbo" if 4o-mini not available
      messages: [
        {
          role: "system",
          content: "You are 'CodeHelper', a coding assistant. Give code with no comments. Give formatted answer."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY, // store your key safely in env
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "OpenAI API error", details: data });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(500).json({ error: "No reply from OpenAI", details: data });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
