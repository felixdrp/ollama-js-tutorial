# Retrieval-Augmented Generation, aka RAG
[← Return to README.md](./README.md)

Retrieval-augmented generation (RAG) is a technique for enhancing the accuracy and reliability of generative AI models with facts fetched from external sources.

Key points:

+ Enhancing the accuracy and reliability of generative AI models with facts fetched from external sources. Equivalent to have a library at the disposition of the LLM.
+ Deeper dive into a current or more specific topic. For example last news or studies.
+ Faster and more economic than LLM model fine-tunning.
+ It allows users to link to private knowledge sources, such as emails, notes, or articles, to improve responses while keeping data secure and private.

How it works:

+ The technique combines Large Language Models (LLMs) with embedding models and vector databases.
+ When a user asks an LLM a question, the AI model sends the query to another model that converts it into a numeric format so machines can read it.
+ RAG uses this numeric version of the query to retrieve relevant information from external sources and augment the LLM's response with accurate and trustworthy information.

## How to improve responses

+ Text splitting chunk size and overlap. The chunk size and overlap can be adjusted to optimize the results.
  - [Text Splitters](https://js.langchain.com/docs/modules/data_connection/document_transformers/)
+ Embeddings
  - [Text embedding models](https://js.langchain.com/docs/modules/data_connection/text_embedding/)
  - Ollama [snowflake-arctic-embed](https://ollama.com/library/snowflake-arctic-embed) is a suite of text embedding models that focuses on creating high-quality retrieval models optimized for performance.
+ Better LLM. Use different LLM models
  - From Ollama [llama3](https://ollama.com/library/llama3) sizes 8b and 70b.
  - From Ollama [gemma](https://ollama.com/library/gemma) sizes 7b and 2b.
  - From Ollama [mixtral](https://ollama.com/library/mixtral) sizes 90b and 26b.

## Sources

+ [Nvidia, What Is Retrieval-Augmented Generation, aka RAG?](https://blogs.nvidia.com/blog/what-is-retrieval-augmented-generation/)
+ [Langchain Retrieval](https://js.langchain.com/docs/modules/data_connection/)
+ [Roie Schwaber-Cohen, Pinecone, Chunking Strategies for LLM Applications](https://www.pinecone.io/learn/chunking-strategies/)