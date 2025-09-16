// server.js
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY; // set in Railway

app.post("/groq", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing text input" });
    }

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              'Extract job title and company name from the given text. Always respond with valid JSON only, in the format: {"jobTitle": "...", "company": "..."}',
          },
          { role: "user", content: text },
        ],
        temperature: 0,
        response_format: { type: "json_object" }, // ✅ forces JSON
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // response is guaranteed JSON
    const extracted = response.data.choices[0].message?.content
      ? JSON.parse(response.data.choices[0].message.content)
      : { jobTitle: null, company: null };

    res.json(extracted);
  } catch (err) {
    console.error("Proxy error:", err.response?.data || err.message, err.stack);
    res
      .status(500)
      .json({ error: err.response?.data || err.message || "Internal error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
