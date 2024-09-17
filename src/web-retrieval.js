// *** Using Ollama to Query to a Web site URL
// https://js.langchain.com/v0.2/docs/tutorials/

import { Ollama } from "@langchain/ollama";
// Used to download a web site.
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
// Used to generate embeddings for MemoryVectorStore
import "@tensorflow/tfjs-node";
import { TensorFlowEmbeddings } from "@langchain/community/embeddings/tensorflow";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const url = 'https://blogs.nvidia.com/blog/what-is-retrieval-augmented-generation/'
const query = "Make a list of the key points of RAG"

// Select a model from Ollama
const llm = new Ollama({
  baseUrl: "http://localhost:11434",
  model: "llama3.1:latest",
  // model: "llama3",
  // model: "qwen2:latest",
  // model: "gemma2:latest",
  // model: "gemma2:2b",
  numCtx: 1000,
});

const loader = new CheerioWebBaseLoader(url);
const data = await loader.load();

// Split the text into 500 character chunks. And overlap each chunk by 20 characters
const textSplitter = new CharacterTextSplitter({
    // Try different sizes of chunk that better suit your model
    // chunkSize: 500,
    // chunkOverlap: 20
    // Llama3 context = 8K
    // chunkSize: 8100,
    chunkSize: 500,
    chunkOverlap: 20
});
const splitDocs = await textSplitter.splitDocuments(data);
console.log(splitDocs)
// Then use the TensorFlow Embedding to store these chunks in the datastore
// const vectorStore = await MemoryVectorStore.fromDocuments(data[0].pageContent, new TensorFlowEmbeddings());
const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, new TensorFlowEmbeddings());
// let a = new TensorFlowEmbeddings()

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
