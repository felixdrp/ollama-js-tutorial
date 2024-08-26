// Use a model in the rol of an Spanish grammar expert
import ollama from 'ollama';

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

console.log(JSON.stringify(response, null, 2));
  