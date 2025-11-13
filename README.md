# Kismat.AI

**Local-first LLM agent for developer productivity & orchestration**  
Tech: **Ollama, LangChain, Copilot Studio, Azure Functions, OpenAI API (future)**

## Overview
Kismat.AI is an R&D project to build a local LLM-based assistant for code completion, CI helpers, and automation orchestration. Local-first design ensures privacy and fast iteration; a hybrid OpenAI integration is planned for cloud-augmented tasks.

## Quickstart (Local with Ollama)
1. Install Ollama (https://ollama.com/docs)
2. Pull or install an LLM: `ollama pull llama2` (example)
3. Run example:
```bash
python3 examples/local_prompt.py
