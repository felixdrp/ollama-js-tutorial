
import { Ollama } from "ollama";
// https://js.langchain.com/v0.2/docs/how_to/recursive_text_splitter/
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// measure embeddings similarity
import similarity from 'compute-cosine-similarity';
import mlDistance from 'ml-distance';

// Read the file for context
const path = './media/herodotus.txt'
const text = await Bun.file(path).text();

const query = "was it easy or hard to survive in Egypt? make a song using the style of the narrator"

const systemTemplate = (context) => `
You are an assistant for question-answering tasks. 
Use the following pieces of retrieved context to answer 
the question. If you don't know the answer, say that you 
don't know. Use three sentences maximum and keep the 
answer concise.

${context}`;

const ollamaBaseUrl = process.env.OLLAMA_URL || "http://localhost:11434"; // Default value

const ollama = new Ollama({
  host: ollamaBaseUrl,
  headers: { 'Authorization': 'Bearer ' + process.env.OLLAMA_API_KEY, }
})

// Model used for embedding
const modelEmbedding = {
  model: 'mxbai-embed-large',
  // model: "snowflake-arctic-embed",
  // model: "snowflake-arctic-embed:110m",
  // model: "snowflake-arctic-embed:22m",
  // model: "nomic-embed-text",
}

// Ollama model settings
const llmSettings = {
  model: 'llama3.2:3b',
  // model: 'qwen2.5:1.5b',
  // model: 'granite3-moe',
  // model: "llama3.2:1b",
  // model: "llama3.2:3b",
  // model: "qwen2:latest",
  numCtx: 5000,
};

const textSplitter = new RecursiveCharacterTextSplitter({
  // Try different sizes of chunk that better suit your model
  chunkOverlap: 20,
  chunkSize: 500,
});

// const splitDocs = await textSplitter.splitText(text);
let splitDocs = await textSplitter.createDocuments([text]);

console.log('Show 3 docs of ' + splitDocs.length);
// console.log(JSON.stringify(docs, null, 2));
console.log(splitDocs.slice(0, 3));

console.time('embedding')
const promptEmbedding =  await ollama.embed({
  ...modelEmbedding,
  input: query,
})

// Send all the texts for embeddings at once
const embeddings = await ollama.embed({
  ...modelEmbedding,
  input: splitDocs.map(doc => doc.pageContent)
})

splitDocs.forEach((doc, index) => {
  doc.embedding = embeddings.embeddings[index]
  // similarity with similarity
  // doc.similarity = similarity(promptEmbedding.embeddings[0], doc.embedding)
  // similarity with ml-distance cosine
  doc.similarity = mlDistance.similarity.cosine(promptEmbedding.embeddings[0], doc.embedding)
})
console.timeEnd('embedding')

// Sort by similarity
splitDocs = splitDocs.sort((a, b) => {
  if (a.similarity < b.similarity) {
    return 1;
  }
  if (a.similarity > b.similarity) {
    return -1;
  }
  // a must be equal to b
  return 0;
})

// Use the 5 most similar texts for the context
const context = splitDocs.slice(0, 5)
  .map((doc, index) => `Doc${index}: ${doc.pageContent}`)
  .join(' ')

// console.log(context)

// Using generate
const answer = await ollama.generate({
  ...llmSettings,
  system: systemTemplate(context),
  prompt: query,  
});

// Using chat
// const answer = await ollama.chat({
//   ...llmSettings,
//   "messages": [
//     {
//       role: "system",
//       content: systemTemplate(context),
//     },
//     {
//       role: "user",
//       content: query,
//     }
//   ]
// });

console.log(answer)
