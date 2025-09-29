chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "POST_JOB") {
    (async () => {
      try {
        console.log("📡 Sending to proxy:", message.text);

        // 1. Call proxy
        const aiRes = await fetch(
          "Your deployed API Base URL/groq goes here",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: message.text }),
          }
        );

        console.log("🔎 Proxy status:", aiRes.status);
        const parsed = await aiRes.json();
        console.log("✅ Proxy response:", parsed);

        if (!parsed.jobTitle || !parsed.company) {
          throw new Error("AI did not return jobTitle/company");
        }

        // 2. Send extracted data to Google Apps Script
        console.log("📡 Sending to Google Sheets...");
        const sheetRes = await fetch(
          "Your Deployed App Script URL goes here",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jobTitle: parsed.jobTitle,
              company: parsed.company,
              url: message.url,
            }),
          }
        );

        const sheetData = await sheetRes.json();
        console.log("✅ Sheets response:", sheetData);

        sendResponse({ status: "success", row: sheetData.row });
      } catch (err) {
        console.error("❌ Background error:", err);
        sendResponse({ status: "error", err: err.toString() });
      }
    })();

    return true; // async
  }
});

