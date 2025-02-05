// Utilize a tool specialized model to invoke a function designed to calculate a math formula.
// https://console.groq.com/docs/tool-use

import { Ollama } from 'ollama'

const ollama = new Ollama({
  host: process.env.OLLAMA_URL || "http://localhost:11434", // Default value
  headers: {'Authorization': 'Bearer ' + process.env.OLLAMA_API_KEY,}
});

const model = 'granite3-dense:8b';
// const model = 'llama3-groq-tool-use';

const userPrompt = "What is 25 * 4 + 10?";

function calculate(expression) {
  try {
    // Note ALERT!: Using eval() in JavaScript can be dangerous!!!
    // In a production environment, you should use a safer alternative.
    const result = eval(expression);
    return JSON.stringify({ result });
  } catch {
    return JSON.stringify({ error: "Invalid expression" });
  }
}

async function runConversation(userPrompt) {
  // Initialize conversation with a user query
  const messages = [
    {
      role: "system",
      content: "You are a calculator assistant. Use the calculate function to perform mathematical operations and provide the results."
    },
    {
      role: "user",
      content: userPrompt,
      // tool_calls: ['calculate'] // not yet valid on ollamajs version v0.5.8
    }
  ];

  const tools = [
    {
      type: "function",
      function: {
        name: "calculate",
        description: "Evaluate a mathematical expression",
        parameters: {
          type: "object",
          properties: {
            expression: {
              type: "string",
              description: "The mathematical expression to evaluate",
            }
          },
          required: ["expression"],
        },
      },
    }
  ];

  // First API call: Send the query and function description to the model
  const response = await ollama.chat({
    model: model,
    messages: messages,
    options: {
      temperature: 0,
    },
    tools: tools
  })

  const responseMessage = response.message;
  const toolCalls = responseMessage.tool_calls;

  if (toolCalls) {
    const availableFunctions = {
      "calculate": calculate,
    };

    messages.push(responseMessage);

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionToCall = availableFunctions[functionName];
      const functionArgs = typeof toolCall.function.arguments == 'string' ?
        JSON.parse(toolCall.function.arguments) :
        toolCall.function.arguments;
      const functionResponse = functionToCall(functionArgs.expression);

      messages.push({
        role: "tool",
        content: functionResponse,
      });
    }

    const secondResponse = await ollama.chat({
      model: model,
      messages: messages
    });

    return secondResponse;
  }

  return responseMessage;
}

runConversation(userPrompt).then(console.log).catch(console.error);
