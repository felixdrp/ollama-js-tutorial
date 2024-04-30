// *** Ollama Query a model using a prompt.
import { Ollama } from "langchain/llms/ollama";

const prompt = `why is the sky blue?`;

// Select a model from Ollama
const ollama = new Ollama({
  baseUrl: "http://localhost:11434",
  model: "llama3",
  // model: "llama2",
  // model: "gemma",
  // model: "dolphincoder",
});

const answer = await ollama.call(prompt);
console.log(answer);
