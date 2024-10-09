# Ollama-js-tutorial
Ollama using JavaScript

Clone this repo:
```bash
git clone https://github.com/felixdrp/ollama-js-tutorial.git

cd langChain-ollama-js-tutorial
```

> If git is not installed, then install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

## Bun (JavaScript Runtime)
Bun is an all-in-one JavaScript runtime & toolkit designed for speed, complete with a bundler, test runner, and Node.js-compatible package manager.

> Install [Bun](https://bun.sh/)

Install options:

+ Linux or Mac
```bash
curl -fsSL https://bun.sh/install | bash
```
+ Mac using brew
```bash
brew install oven-sh/bun/bun # for macOS and Linux
```
If you don't have [brew](https://brew.sh/) installed:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

+ Windows
```
powershell -c "irm bun.sh/install.ps1 | iex"
```

## Ollama (Run large language models)

Install options:

+ Direct install of [Ollama](https://ollama.com/download)

+ Container version of [Ollama (container)](https://hub.docker.com/r/ollama/ollama)
    - You NEED a container provider like docker or podman. Install [docker](https://docs.docker.com/engine/install/).
    - Multiple container alternatives like CPU (default), Nvidia and AMD GPU rocm. For GPU you NEED docker.

General [Ollama docs](https://github.com/ollama/ollama/tree/main/docs).

### Install a model

Install Llama3.1:

```bash
# Direct install 
ollama run llama3.1
```

Install on a container:
```bash
docker exec -it ollama ollama run llama3.1
```

### List models

```bash
# Direct install 
ollama list
# Container version
docker exec -it ollama ollama list
```

## Install Javascript Packages
After we cloned the repository we need to install the project packages.

```bash
bun install
```

## Run examples

> If you use Ollama on a container, please, run the container before running the examples.

Model prompting

```bash
bun src/prompting.js
```

Web prompting using on memory RAG ()

```bash
bun src/web-retrieval.js
```

Prompting using an image
```bash
# Example file needs minicpm-v model.
bun src/query-image.js media/576px-Pennywell_Farm_is_home_to_some_beautiful_Highland_Cows.jpg
```

## About

+ [Langchain framework use cases](https://js.langchain.com/docs/use_cases)
+ [Ollama models](https://ollama.com/library)
+ [RAG Retrieval-Augmented Generation](RAG.md) 
