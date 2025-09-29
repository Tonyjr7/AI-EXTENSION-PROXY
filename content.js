// Get page info
const url = window.location.href;
let company =
  document.querySelector(".topcard__org-name")?.innerText ||
  document.querySelector(".companyName")?.innerText ||
  document.querySelector(".employerName")?.innerText ||
  "";

let jobTitle =
  document.querySelector(".topcard__title")?.innerText ||
  document.querySelector(".jobsearch-JobInfoHeader-title")?.innerText ||
  document.querySelector(".css-17x2pwl.e11nt52q6")?.innerText ||
  "";

// Create a "Save Job" button
const btn = document.createElement("button");
btn.innerText = "Save Job";
btn.style.position = "fixed";
btn.style.bottom = "20px";
btn.style.right = "20px";
btn.style.zIndex = 9999;
btn.style.padding = "10px 15px";
btn.style.backgroundColor = "#0073b1";
btn.style.color = "white";
btn.style.border = "none";
btn.style.borderRadius = "5px";
btn.style.cursor = "pointer";

// Append the button to the page
document.body.appendChild(btn);

// Add click listener AFTER creating the button
btn.addEventListener("click", () => {
  chrome.runtime.sendMessage(
    { type: "POST_JOB", data: { url, company, jobTitle } },
    (response) => {
      if (response.status === "success") {
        console.log("Job added:", response.data);
        btn.innerText = "Saved!";
        btn.disabled = true;
        btn.style.backgroundColor = "gray";
      } else {
        console.error("Error posting job:", response.err);
      }
    }
  );
});
