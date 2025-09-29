# AI Extension Proxy

A Chrome browser extension that uses AI to extract job information from web pages and automatically saves it to Google Sheets. Built with a Node.js proxy server that interfaces with Groq's AI API.

---

## 🚀 Features

- **AI-Powered Job Extraction**: Uses Groq's Llama 3.1 model to intelligently extract job titles and company names from job posting pages  
- **One-Click Save**: Save job listings with a single click directly from your browser  
- **Google Sheets Integration**: Automatically saves extracted job data to Google Sheets  
- **Cross-Platform Support**: Works on popular job sites like LinkedIn, Indeed, and others  
- **Modern UI**: Beautiful, responsive popup interface with gradient animations  

---

## 📋 Prerequisites

- Node.js (v14 or higher)  
- Chrome Browser  
- Groq API Key (Get one [here](https://groq.com))  
- Google Apps Script deployment for Google Sheets integration  

---

# 🔄 Flow Diagram

```mermaid
flowchart TD
    A([🧑 User on Job Page]) -->|Clicks "Save Job"| B[[🔌 Chrome Extension Popup]]
    B --> C[[📝 content.js<br>Scrape DOM]]
    C --> D{Extracted Job Text}
    D --> E[[⚙️ background.js]]
    E --> F[📡 POST → Railway Proxy<br>`/groq` endpoint]
    F --> G[[🌐 server.js<br>Adds Groq API Key]]
    G --> H[[🤖 Groq API<br>Llama 3.1 Model]]
    H --> I[[📦 JSON Response<br>{jobTitle, company}]]
    I --> J[[⚙️ background.js]]
    J --> K[📡 POST → Google Apps Script]
    K --> L[[📊 Google Sheet<br>Append Row]]
    L --> M([✅ Success → Popup UI])

    %% Styling
    style A fill:#fff,stroke:#555,stroke-width:1px
    style B fill:#e0f7fa,stroke:#0288d1,stroke-width:2px
    style C fill:#f1f8e9,stroke:#388e3c,stroke-width:2px
    style D fill:#fff9c4,stroke:#fbc02d,stroke-width:2px
    style E fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style F fill:#ffe0b2,stroke:#f57c00,stroke-width:2px
    style G fill:#ede7f6,stroke:#5e35b1,stroke-width:2px
    style H fill:#f8bbd0,stroke:#c2185b,stroke-width:2px
    style I fill:#d1c4e9,stroke:#4527a0,stroke-width:2px
    style J fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style K fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style L fill:#bbdefb,stroke:#1565c0,stroke-width:2px
    style M fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px

---

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Tonyjr7/AI-EXTENSION-PROXY.git
cd AI-EXTENSION-PROXY
````

### 2. Set Up the Proxy Server

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

Start the server:

```bash
npm start
```

The proxy server will run on port `3000` by default.

### 3. Deploy to Railway (Recommended for Production)

1. Create an account at [Railway](https://railway.app)
2. Connect your GitHub repository
3. Set the `GROQ_API_KEY` environment variable in Railway
4. Deploy your application

### 4. Set Up Google Sheets Integration

1. Create a new Google Sheets document
2. Open **Extensions > Apps Script**
3. Replace the default code with:

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const timestamp = new Date();
  const row = sheet.appendRow([
    timestamp,
    data.jobTitle,
    data.company,
    data.url
  ]);

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    row: sheet.getLastRow()
  })).setMimeType(ContentService.MimeType.JSON);
}
```

4. Deploy the script as a web app:

   * Click **Deploy > New deployment**
   * Type: **Web app**
   * Execute as: **Me**
   * Who has access: **Anyone**
   * Copy the deployment URL

### 5. Configure the Extension

Update `background.js` with your deployed URLs:

```javascript
// Replace these URLs
const aiRes = await fetch("YOUR_RAILWAY_URL/groq", {...});
const sheetRes = await fetch("YOUR_GOOGLE_SCRIPT_URL", {...});
```

Load the extension in Chrome:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the extension folder

---

## 🎯 Usage

1. Navigate to any job posting page
2. Click the extension icon in your browser toolbar
3. Click **Save Job** in the popup

The extension will:

* Extract job description text from the page
* Use AI to identify the job title and company
* Save the data to your Google Sheets document

---

## 🛠️ How It Works

**Architecture Flow**:

1. **Content Extraction**: Extension scrapes job description text from the current page
2. **AI Processing**: Sends text to proxy server which calls Groq's API
3. **Data Extraction**: AI extracts structured job information (title, company)
4. **Sheet Storage**: Saves extracted data to Google Sheets via Apps Script

**Key Components**:

* `server.js`: Express proxy server that interfaces with Groq API
* `background.js`: Handles communication between popup and external services
* `content.js`: Injected into pages to scrape job information
* `popup.js`: Manages the extension popup interface
* `manifest.json`: Extension configuration and permissions

---

## 🔧 Customization

### Supported Job Sites

The extension includes selectors for:

* LinkedIn (`.topcard__org-name`, `.topcard__title`)
* Indeed (`.companyName`, `.jobsearch-JobInfoHeader-title`)
* Generic fallbacks for other sites

Add more selectors in `content.js` for additional job sites.

### AI Prompt Customization

Modify the system prompt in `server.js`:

```javascript
messages: [
  {
    role: "system",
    content: "Your custom extraction instructions here..."
  },
  { role: "user", content: text }
]
```

---

## 🚨 Troubleshooting

**Extension not working on job sites**

* Check browser console for errors
* Verify job site selectors in `content.js`
* Ensure proper URL permissions in `manifest.json`

**AI extraction failing**

* Verify Groq API key is correctly set
* Check proxy server logs for errors
* Test the API endpoint directly

**Google Sheets not updating**

* Verify Apps Script deployment URL
* Check Apps Script execution logs
* Ensure proper permissions are set

---

## 🔒 Security Notes

* Never commit your API keys to version control
* Use environment variables for sensitive data
* Regularly rotate API keys
* Monitor API usage to prevent abuse

---

## 🤝 Contributing

Contributions are welcome! Please submit a Pull Request. For major changes, open an issue first to discuss what you’d like to change.

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 🙏 Acknowledgments

* **Groq** for providing the AI API
* **Google Apps Script** for spreadsheet integration
* **The open-source community** for various dependencies

```
