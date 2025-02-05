// Utilize a tool specialized model to invoke a function designed to retrieve information about individuals.
import { Ollama } from 'ollama'

const ollama = new Ollama({
  host: process.env.OLLAMA_URL || "http://localhost:11434", // Default value
  headers: {'Authorization': 'Bearer ' + process.env.OLLAMA_API_KEY,}
});

const inputText = `Alex is 5 feet tall.
Claudia is 1 foot taller than Alex and jumps higher than him.
Claudia has orange hair and Alex is blonde.`;

const extractionPrompt = (input) => `Extract and save the relevant entities mentioned in the following passage together with their properties.

Passage:
${input}
`;

const response = await ollama.chat({
  // model: 'granite3-dense',
  // model: 'granite3-dense:8b',
  // model: 'granite3-moe',
  model: 'llama3-groq-tool-use',
  // options: {
  //     temperature: 0.1,
  // },
  messages: [{ role: 'user', content: extractionPrompt(inputText) }],
  tools: [
    {
      type: 'function',
      function: {
        name: "information_extraction",
        description: "Extracts the relevant information from the passage.",
        parameters: {
          type: 'object',
          properties: {
            people: { 
              type: 'array',
              items: {
                type: "object",
                properties: {
                  name: { description: "The name of a person", type: "string" },
                  height: { description: "The person's height", type: "number" },
                  hairColor: { description: "The person's hair color", type: "string" },
                },
                required: ['name', 'height', 'hairColor'],
              }
            }
          },
          required: ['people'],
        },
      },
    }, 
  ]
})

console.log(JSON.stringify(response, null, 2));
