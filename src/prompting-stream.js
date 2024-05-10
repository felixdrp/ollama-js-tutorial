// *** Ollama querying a model set on stream mode.
// * Use it for a more dynamic UI experience

const {readable, writable} = new TransformStream();

const controller = new AbortController();

const stream = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: "Count from 0 to 10",
    model: "codegemma:instruct",
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