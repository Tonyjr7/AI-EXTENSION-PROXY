const saveBtn = document.getElementById("saveBtn");
const statusDiv = document.getElementById("status");

saveBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    // Capture job description text (or full body if not found)
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => {
          const main = document.querySelector(
            ".job-description, [data-test='job-description'], .description, article, main"
          );

          // Scrape job description if found, else fallback to body text
          return (main ? main.innerText : document.body.innerText).slice(
            0,
            6000
          );
        },
      },
      (results) => {
        const rawText = results[0].result;

        // Send scraped text to background for AI + Google Sheets
        chrome.runtime.sendMessage(
          { type: "POST_JOB", text: rawText, url: tab.url },
          (response) => {
            if (response.status === "success") {
              statusDiv.textContent = `Saved! Row: ${response.row}`;
              saveBtn.disabled = true;
            } else {
              statusDiv.textContent = "Error: " + response.err;
            }
          }
        );
      }
    );
  });
});
