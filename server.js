import express from "express";
import cors from "cors";
import "dotenv/config";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
const app = express();
app.use(cors());
const port = 5500;
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 500,
  responseMimeType: "text/plain",
};

const chatSession = model.startChat({
  generationConfig,
  // safetySettings: Adjust safety settings
  // See https://ai.google.dev/gemini-api/docs/safety-settings
  history: [],
});

app.post("/messages", async (req, res) => {
  // const userMessage = req.body.message;
  const result = await chatSession.sendMessage(req.body.message);
  // console.log(result.response.text());
  res.json({ reply: result.response.text() });
});

try {
  app.listen(port, () => {
    console.log(`Node js Server Runing on port :${port}`);
  });
} catch (error) {
  console.log("Failed to Connect :", error);
}
