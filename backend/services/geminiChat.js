import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const model = genAI.getGenerativeModel(
    {model: "gemini-3-flash-preview"},
    { apiVersion: 'v1beta'}
);

export async function runChat(userMessage, context) {
  if (!userMessage || typeof userMessage !== "string") {
    throw new Error("Mensagem vazia ou inválida");
  }

  const prompt = `${context} : ${userMessage}`;

  const result = await model.generateContent(prompt);
  console.log(prompt)
  return result.response.text();
}
