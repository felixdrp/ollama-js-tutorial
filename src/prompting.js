// *** Ollama Query a model using a prompt.
import { Ollama } from "@langchain/ollama";

const prompt = `why is the sky blue?`;

// Select a model from Ollama
const ollama = new Ollama({
  baseUrl: "http://localhost:11434",
  model: "gemma2:2b",
  // model: "llama3.1:latest",
});

const answer = await ollama.invoke(prompt);
console.log(answer);
