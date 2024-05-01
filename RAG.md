# Retrieval-Augmented Generation, aka RAG
[← Return to README.md](./README.md)

Retrieval-augmented generation (RAG) is a technique for enhancing the accuracy and reliability of generative AI models with facts fetched from external sources.

Key points:

+ Enhancing the accuracy and reliability of generative AI models with facts fetched from external sources. Equivalent to have a library at the disposition of the LLM
+ Deeper dive into a current or more specific topic. For example last news or studies.
+ Faster and more economic than LLM model fine-tunning.
+ It allows users to link to private knowledge sources, such as emails, notes, or articles, to improve responses while keeping data secure and private.

How it works:

+ The technique combines Large Language Models (LLMs) with embedding models and vector databases.
+ When a user asks an LLM a question, the AI model sends the query to another model that converts it into a numeric format so machines can read it.
+ RAG uses this numeric version of the query to retrieve relevant information from external sources and augment the LLM's response with accurate and trustworthy information.

## Sources

+ [Nvidia, What Is Retrieval-Augmented Generation, aka RAG?](https://blogs.nvidia.com/blog/what-is-retrieval-augmented-generation/)
+ [Langchain Retrieval](https://js.langchain.com/docs/modules/data_connection/)
