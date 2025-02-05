// Utilize a tool specialized model to invoke a function designed to retrieve information about flight times.
// Simulates an API call to get flight times
// In a real application, this would fetch data from a live database or API

// Step 1 - Firts we call the model to generate the function to call
// Step 2 - Then we use the returned tool call as input parameters for a local function "getFlightTimes"
// Step 3 - Finally, we call the model to generate a response with the output from the local function.

import { Ollama } from 'ollama'

const ollama = new Ollama({
  host: process.env.OLLAMA_URL || "http://localhost:11434", // Default value
  headers: {'Authorization': 'Bearer ' + process.env.OLLAMA_API_KEY,}
});

// const modelToolsTrained = 'llama3-groq-tool-use';
const modelToolsTrained = 'granite3-dense:8b';

function getFlightTimes(departure, arrival) {
  const flights = {
    "NYC-LAX": { departure: "08:00 AM", arrival: "11:30 AM", duration: "5h 30m" },
    "LAX-NYC": { departure: "02:00 PM", arrival: "10:30 PM", duration: "5h 30m" },
    "LHR-JFK": { departure: "10:00 AM", arrival: "01:00 PM", duration: "8h 00m" },
    "JFK-LHR": { departure: "09:00 PM", arrival: "09:00 AM", duration: "7h 00m" },
    "CDG-DXB": { departure: "11:00 AM", arrival: "08:00 PM", duration: "6h 00m" },
    "DXB-CDG": { departure: "03:00 AM", arrival: "07:30 AM", duration: "7h 30m" }
  };

  const key = `${departure}-${arrival}`.toUpperCase();
  return JSON.stringify(flights[key] || { error: "Flight not found" });
}

async function run(model) {
  // Initialize conversation with a user query
  let messages = [{ role: 'user', content: 'What is the flight time from New York (NYC) to Los Angeles (LAX)?' }];

  // First API call: Send the query and function description to the model
  const response = await ollama.chat({
    model: model,
    messages: messages,
    // options: {
    //     temperature: 0.1,
    // },
    tools: [
      {
        type: 'function',
        function: {
          name: 'get_flight_times',
          description: 'Get the flight times between two cities',
          parameters: {
            type: 'object',
            properties: {
              departure: {
                type: 'string',
                description: 'The departure city (airport code)',
              },
              arrival: {
                type: 'string',
                description: 'The arrival city (airport code)',
              },
            },
            required: ['departure', 'arrival'],
          },
        },
      },
    ],
  })
  // Add the model's response to the conversation history
  messages.push(response.message);
  console.log(JSON.stringify(response, null, 2));
  
  // Check if the model decided to use the provided function
  if (!response.message.tool_calls || response.message.tool_calls.length === 0) {
    console.log("The model didn't use the function. Its response was:");
    console.log(response.message.content);
    return;
  }

  // Process function calls made by the model
  if (response.message.tool_calls) {
    const availableFunctions = {
      get_flight_times: getFlightTimes,
    };
    for (const tool of response.message.tool_calls) {
      const functionToCall = availableFunctions[tool.function.name];
      const functionResponse = functionToCall(
        tool.function.arguments.departure,
        tool.function.arguments.arrival
      );
      // Add function response to the conversation
      messages.push({
        role: 'tool',
        content: functionResponse,
      });
    }
  }

  // Second API call: Get final response from the model
  const finalResponse = await ollama.chat({
    model: model,
    messages: messages,
    options: {
      temperature: 0.1,
    },
  });
  console.log(finalResponse.message.content);
}

run(
  modelToolsTrained
).catch(error => console.error("An error occurred:", error));
