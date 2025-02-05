// *** Ollama Query a model using a prompt.
import { Ollama } from "ollama";
const ollamaBaseUrl = process.env.OLLAMA_URL || "http://localhost:11434"; // Default value
const ollama = new Ollama({
  host: ollamaBaseUrl,
  headers: {'Authorization': 'Bearer ' + process.env.OLLAMA_API_KEY,}
})

const prompt = `why is the sky blue?`;

// Select a model from Ollama
const answer = await ollama.generate({
  model: 'llama3.2:3b',
  // model: 'qwen2.5:1.5b',
  prompt,
});

console.log(answer);
