exports.handler = async (event) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not set");
    }

    const data = JSON.parse(event.body);

    const prompt = `
You are an expert content creator.

Platform: ${data.platform}
Topic: ${data.topic}
Style: ${data.style}
Keyword: ${data.keyword || ""}

Rules:
- Follow platform best practices
- Write engaging, human content
${data.hashtags ? "- Include hashtags and emojis" : ""}
${data.cta ? "- Include a clear call to action" : ""}
`;

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

    const json = await response.json();

    const text =
      json.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No content generated.";

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, result: text })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};
