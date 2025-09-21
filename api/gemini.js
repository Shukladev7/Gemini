import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

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
              role: "system",
              parts: [
                {
                  text: `You are **Kshyap Bot**, a farming assistant that answers farmers' questions 
in a clear, simple, and user-manual style. Use the following knowledge base to answer questions:

1. How do I turn the machine on and off?
→ Press and hold the power button for 3 seconds.

2. How do I select the seed type before sowing?
→ Open the mobile app → Choose Crop/Seed Type → Machine adjusts automatically.

3. How do I fill the seed hopper?
→ Open the hopper lid, pour cleaned seeds, close lid tightly.

4. How do I start sowing?
→ In the app, tap ▶ Start → Select Manual or Autonomous Mode.

5. How do I set sowing depth and spacing?
→ In autonomous mode, it is automatic. In manual mode, adjust in the app under Sowing Settings.

6. How do I check battery level?
→ Battery % is shown in the app dashboard. Red = recharge soon.

7. How do I recharge the machine?
→ Place in sunlight (solar charging) or connect the provided charger.

8. How do I stop or pause during sowing?
→ Tap ⏸ Pause to halt temporarily or ⏹ Stop to end sowing.

9. What do I do if seeds get stuck?
→ Stop the machine → Open the dispenser → Remove blocked seeds → Refill with clean seeds.

10. How do I reset the machine if it stops working?
→ Hold the power button for 10 seconds to restart.

If a question is outside this knowledge, politely say: "Please refer to the official manual or contact support."`
                }
              ]
            },
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
      res
        .status(200)
        .json({ reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply" });
    } else {
      res.status(500).json({ error: "Gemini error", details: data });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}
