// *** Ollama Query a model using a prompt.
import { Ollama } from "@langchain/ollama";

const prompt = `why is the sky blue?`;

const ollamaBaseUrl = process.env.OLLAMA_URL || "http://localhost:11434"; // Default value

// Select a model from Ollama
const ollama = new Ollama({
  baseUrl: ollamaBaseUrl,
  model: 'llama3.2:3b',
  // model: 'qwen2.5:1.5b',
});

const answer = await ollama.invoke(prompt);
console.log(answer);
