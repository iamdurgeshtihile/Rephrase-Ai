
import { GoogleGenAI, Chat } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export function startChat(): Chat {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
  });
  return chat;
}

export async function sendMessage(
  chat: Chat,
  message: string
): Promise<string> {
  if (!message.trim()) {
    throw new Error("Input text cannot be empty.");
  }

  try {
    const response = await chat.sendMessage({ message });
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a response from the AI. Please try again.");
  }
}