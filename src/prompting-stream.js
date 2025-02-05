// *** Ollama querying a model set on stream mode.
// * Use it for a more dynamic UI experience

const {readable, writable} = new TransformStream();
const controller = new AbortController();
const ollamaBaseUrl = process.env.OLLAMA_URL || "http://localhost:11434"; // Default value

const stream = await fetch(ollamaBaseUrl + "/api/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    'Authorization': 'Bearer ' + process.env.OLLAMA_API_KEY,
  },
  body: JSON.stringify({
    prompt: "Count from 0 to 10. Use only numbers and commas.",
    model: "phi3.5",
    stream: true,
  }),
  signal: controller.signal,
});

const reader = stream.body.getReader();
try {
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
  
    const chunk = new TextDecoder().decode(value);
    console.log(chunk);
  }
} catch (error) {
  console.log(error)
}

// Stop the model response after 5 seconds
// setTimeout(() => {
//     // controller.abort();
//   }, 5000); 