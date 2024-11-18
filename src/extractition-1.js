// *** Ollama nuextract model example 1, using nuextract model to extract info from a text.
// https://ollama.com/library/nuextract
import { Ollama } from 'ollama'

const prompt = `### Template:
{
    "Model": {
        "Name": "",
        "Number of parameters": "",
    },
    "Usage": {
        "Use case": [],
        "Licence": ""
    }
}
### Example:
{
    "Model": {
        "Name": "Llama3",
        "Number of parameters": "8 billion",
    },
    "Usage": {
        "Use case":[
			"chat",
			"code completion"
		],
        "Licence": "Meta Llama3"
    }
}
### Text:
We introduce Mistral 7B, a 7–billion-parameter language model engineered for superior performance and efficiency. Mistral 7B outperforms the best open 13B model (Llama 2) across all evaluated benchmarks, and the best released 34B model (Llama 1) in reasoning, mathematics, and code generation. Our model leverages grouped-query attention (GQA) for faster inference, coupled with sliding window attention (SWA) to effectively handle sequences of arbitrary length with a reduced inference cost. We also provide a model fine-tuned to follow instructions, Mistral 7B – Instruct, that surpasses Llama 2 13B – chat model both on human and automated benchmarks. Our models are released under the Apache 2.0 license. 

Code: https://github.com/mistralai/mistral-src 
Webpage: https://mistral.ai/news/announcing-mistral-7b/`;

const ollama = new Ollama({
  host: process.env.OLLAMA_URL || "http://localhost:11434", // Default value
  headers: {
    API_KEY: process.env.API_KEY || 'guest',
  },
});

const response = await ollama.generate({
  model: 'nuextract',
  prompt: prompt,
  stream: false,
  options: {
    // seed: 123
    // seed: 314
  }
})

console.log(response)