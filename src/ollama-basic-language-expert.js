// Use a model in the rol of a Spanish grammar expert
import { Ollama } from "ollama";

const ollama = new Ollama({
  host: process.env.OLLAMA_URL || "http://localhost:11434",
  headers: { 'Authorization': 'Bearer ' + process.env.OLLAMA_API_KEY, }
});

const inputText = `Comer me gustaria un paella.`;

const extractionPrompt = (input) => `You are a Spanish grammar expert. Check the next text
\`\`\`${input}\`\`\`. Explain it using English.
`;

const prompt = extractionPrompt(inputText)
console.log(prompt)

const response = await ollama.chat({
    model: 'phi3.5',
    messages: [{role: 'user', content:prompt}]
})

// console.log(JSON.stringify(response, null, 2));
console.log(response);
  