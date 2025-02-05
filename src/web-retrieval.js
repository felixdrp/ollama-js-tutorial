// *** Using Ollama to Query a Web site using URL

import { Ollama } from "ollama";
// Used to download a web site.
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

// https://js.langchain.com/v0.2/docs/how_to/recursive_text_splitter/
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// measure embeddings similarity
import similarity from 'compute-cosine-similarity';
import mlDistance from 'ml-distance';

const url = 'https://blogs.nvidia.com/blog/what-is-retrieval-augmented-generation/'
const query = "Make a list of the key points of RAG"

const ollamaBaseUrl = process.env.OLLAMA_URL || "http://localhost:11434"; // Default value

const systemTemplate = (context) => `
You are an assistant for question-answering tasks. 
Use the following pieces of retrieved context to answer 
the question. If you don't know the answer, say that you 
don't know. Use three sentences maximum and keep the 
answer concise.

${context}`;

const ollama = new Ollama({
  host: ollamaBaseUrl,
  headers: { 'Authorization': 'Bearer ' + process.env.OLLAMA_API_KEY, }
})

const loader = new CheerioWebBaseLoader(url);
const data = await loader.load();

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

// Split the text into 500 character chunks. And overlap each chunk by 20 characters
const textSplitter = new RecursiveCharacterTextSplitter({
  // Try different sizes of chunk that better suit your model
  chunkSize: 500,
  chunkOverlap: 20,
});

let splitDocs = await textSplitter.splitDocuments(data);

console.log('Show 3 docs of ' + splitDocs.length);
// console.log(JSON.stringify(docs, null, 2));
console.log(splitDocs.slice(0, 3));

console.time('embedding')
const promptEmbedding =  await ollama.embed({
  ...modelEmbedding,
  input: query,
})

for await (const doc of splitDocs) {
  const embedding = await ollama.embed({
    ...modelEmbedding,
    input: doc.pageContent,
  })
  doc.embedding = embedding.embeddings[0]
  // similarity with similarity
  // doc.similarity = similarity(promptEmbedding.embeddings[0], doc.embedding)
  // similarity with ml-distance cosine
  doc.similarity = mlDistance.similarity.cosine(promptEmbedding.embeddings[0], doc.embedding)
}
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
