// lib/llm/OllamaLLMRepository.ts
import { ChatOllama } from "@langchain/ollama";
import { ILLMRepository } from "./ILLMRepository";

interface OllamaLLMOptions {
  model?: string;
  baseUrl?: string;
  temperature?: number;
  maxRetries?: number;
}

export class OllamaLLMRepository implements ILLMRepository {
  private llm: ChatOllama;

  constructor(options: OllamaLLMOptions = {}) {
    const {
      model = "llama3",
      baseUrl = process.env.OLLAMA_API_URL || "http://localhost:11434",
      temperature = 0.7,
      maxRetries = 2,
    } = options;

    this.llm = new ChatOllama({
      model,
      temperature,
      baseUrl,
      maxRetries,
    });
  }

  getLLM(): ChatOllama {
    return this.llm;
  }
}