// generate.js
exports.handler = async (event) => {
  try {
    // 1️⃣ Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }

    // 2️⃣ Parse incoming JSON safely
    let data;
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      throw new Error("Invalid JSON in request body.");
    }

    const { platform, topic, style, keyword, hashtags, cta } = data;

    if (!platform || !topic || !style) {
      throw new Error("Missing required fields: platform, topic, and style are required.");
    }

    // 3️⃣ Build the prompt
    const prompt = `
You are an expert content creator.

Platform: ${platform}
Topic: ${topic}
Style: ${style}
Keyword: ${keyword || ""}

Rules:
- Follow platform best practices
- Write engaging, human content
${hashtags ? "- Include hashtags and emojis" : ""}
${cta ? "- Include a clear call to action" : ""}
`;

    // 4️⃣ Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    // 5️⃣ Parse API response
    const json = await response.json();
    console.log("Gemini API response:", JSON.stringify(json, null, 2)); // ✅ Helpful for debugging

    if (!json.candidates || !json.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error("No content returned from Gemini API.");
    }

    const text = json.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, result: text })
    };

  } catch (error) {
    console.error("Error in generate.js handler:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};

