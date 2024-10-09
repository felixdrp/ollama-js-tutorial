import { Ollama } from "@langchain/ollama";
// https://js.langchain.com/v0.2/docs/how_to/recursive_text_splitter/
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
// Used to generate embeddings for MemoryVectorStore
import "@tensorflow/tfjs-node";
import { TensorFlowEmbeddings } from "@langchain/community/embeddings/tensorflow";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const path = './media/herodotus.txt'
const query = "tell us about Egypt"

// Select a model from Ollama
const llm = new Ollama({
  baseUrl: "http://localhost:11434",
  model: "llama3.2:3b",
  // model: "llama3.1:latest",
  // model: "qwen2:latest",
  numCtx: 1000,
});

const text = await Bun.file(path).text();

const textSplitter = new RecursiveCharacterTextSplitter({
  // Try different sizes of chunk that better suit your model
  // chunkSize: 500,
  // chunkOverlap: 20
  // Llama3 context = 8K
  // chunkSize: 8100,
  chunkSize: 1000,
  chunkOverlap: 100
});

// const splitDocs = await textSplitter.splitText(text);
const splitDocs = await textSplitter.createDocuments([text]);

// console.log(JSON.stringify(docs, null, 2));
console.log(splitDocs);

const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, new TensorFlowEmbeddings());

const retriever = vectorStore.asRetriever();

const systemTemplate = [
  `You are an assistant for question-answering tasks. `,
  `Use the following pieces of retrieved context to answer `,
  `the question. If you don't know the answer, say that you `,
  `don't know. Use three sentences maximum and keep the `,
  `answer concise.`,
  `\n\n`,
  `{context}`,
].join("");

const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["human", "{input}"],
]);

const questionAnswerChain = await createStuffDocumentsChain({ llm, prompt });
const ragChain = await createRetrievalChain({
  retriever,
  combineDocsChain: questionAnswerChain,
});

const result = await ragChain.invoke({input: query});
console.log(result)

