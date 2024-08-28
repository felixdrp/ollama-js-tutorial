// Utilize a tool specialized model to invoke a function designed to get an answer and citations.
// https://js.langchain.com/v0.2/docs/how_to/qa_citations/#cite-documents

import ollama from 'ollama';
import { z } from 'zod';
import { zodToJsonSchema } from "zod-to-json-schema";

const model = 'llama3.1'
const exampleQ = `What is Brian's height?

Source: 1
Information: Suzy is 6'2"

Source: 2
Information: Jeremiah is blonde

Source: 3
Information: Brian is 3 inches shorter than Suzy`;

// Initialize conversation with a user query
const messages = [
  {
    role: "user",
    content: exampleQ,
    // tool_calls: ['cited_answers'] // not yet valid on ollamajs version v0.5.8
  }
];

const citedAnswersSchema = z.object({
  answer: z.string(),
  citations: z.array(z.number()),
});

const tool =   z.object({
  answer: z.string()
    .describe(
      "The answer to the user question, which is based only on the given sources."
    ),
  citations: z.array(z.number())
    .describe(
      "The integer IDs of the SPECIFIC sources which justify the answer."
    ),
})

const tools = [
  {
    type: "function",
    function: {
      name: "cited_answers",
      description: "A cited source from the given text",
      parameters: zodToJsonSchema(tool),
    }
  }
];

console.log(JSON.stringify(tools, null, 2));

// First API call: Send the query and function description to the model
const response = await ollama.chat({
  model: model,
  messages: messages,
  options: {
    temperature: 0,
  },
  tools: tools
})

console.log(JSON.stringify(response, null, 2));
