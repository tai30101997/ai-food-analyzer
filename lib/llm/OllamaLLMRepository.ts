// lib/llm/OllamaLLMRepository.ts
import { ChatOllama } from "@langchain/ollama";
import { ILLMRepository } from "./ILLMRepository";

export class OllamaLLMRepository implements ILLMRepository {
  private llm: ChatOllama;
  constructor() {
    this.llm = new ChatOllama({
      model: "llama3",
      temperature: 0.7,
      baseUrl: process.env.OLLAMA_API_URL || "http://localhost:11434",
      maxRetries: 2,
    });
  }
  getLLM(): ChatOllama {
    return this.llm;
  }
}