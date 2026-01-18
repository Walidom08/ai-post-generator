async function generateContent() {
  const data = {
    topic: document.getElementById("topic").value,
    platform: document.getElementById("platform").value,
    style: document.getElementById("style").value,
    keyword: document.getElementById("keyword").value,
    hashtags: document.getElementById("hashtags").checked,
    cta: document.getElementById("cta").checked
  };

  document.getElementById("output").textContent = "Generating...";

  try {
    const response = await fetch("/.netlify/functions/generate", {
      method: "POST",
      body: JSON.stringify(data)
    });

    const result = await response.json();
    document.getElementById("output").textContent =
      result.result || result.message;

  } catch (error) {
    document.getElementById("output").textContent =
      "Error generating content.";
  }
}
