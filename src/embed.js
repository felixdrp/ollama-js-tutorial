// *** Ollama embedding
// https://ollama.com/blog/embedding-models
import { Ollama } from "ollama";
const ollama = new Ollama({
  host: process.env.OLLAMA_URL || "http://localhost:11434", // Default value,
  headers: { 'Authorization': 'Bearer ' + process.env.OLLAMA_API_KEY, }
})

const embed = await ollama.embed({
  model: 'mxbai-embed-large',
  input: 'Llamas are members of the camelid family',
})

console.log(embed)