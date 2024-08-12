// *** Using Ollama to Query to a Web site URL

import { Ollama } from "langchain/llms/ollama";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import "@tensorflow/tfjs-node";
import { TensorFlowEmbeddings } from "langchain/embeddings/tensorflow";

import { RetrievalQAChain } from "langchain/chains";

const url = 'https://blogs.nvidia.com/blog/what-is-retrieval-augmented-generation/'
const query = "Make a list of the key points of RAG"

// Select a model from Ollama
const ollama = new Ollama({
  baseUrl: "http://localhost:11434",
  // model: "llama3.1:latest",
  // model: "llama3",
  // model: "qwen2:latest",
  // model: "gemma2:latest",
  model: "gemma2:2b",
});

const loader = new CheerioWebBaseLoader(url);
const data = await loader.load();

// Split the text into 500 character chunks. And overlap each chunk by 20 characters
const textSplitter = new RecursiveCharacterTextSplitter({
    // Try different sizes of chunk that better suit your model
    // chunkSize: 500,
    // chunkOverlap: 20
    // Llama3 context = 8K
    // chunkSize: 8100,
    chunkSize: 2000,
    chunkOverlap: 45
});
const splitDocs = await textSplitter.splitDocuments(data);
console.log(splitDocs)
// Then use the TensorFlow Embedding to store these chunks in the datastore
// const vectorStore = await MemoryVectorStore.fromDocuments(data[0].pageContent, new TensorFlowEmbeddings());
const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, new TensorFlowEmbeddings());
let a = new TensorFlowEmbeddings()

const retriever = vectorStore.asRetriever();
const chain = RetrievalQAChain.fromLLM(ollama, retriever);
const result = await chain.call({query: query});
console.log(result.text)
console.log(await ollama.call(result.text + ` ASK YOUR QUESTION HERE `))