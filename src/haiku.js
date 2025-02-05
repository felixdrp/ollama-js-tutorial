// *** Ollama Query a model using a prompt.
import { Ollama } from "ollama";
const ollamaBaseUrl = process.env.OLLAMA_URL || "http://localhost:11434"; // Default value
const ollama = new Ollama({
  host: ollamaBaseUrl,
  headers: { 'Authorization': 'Bearer ' + process.env.OLLAMA_API_KEY, }
})

// Chat example
const answer = await ollama.chat({
  model: 'llama3.2:3b',
  // model: 'qwen2.5:1.5b',
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "Write a haiku that explains the concept of recursion."
    }
  ]
});
console.log(answer);