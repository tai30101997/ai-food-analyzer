// lib/llm/OpenAILLMRepository.ts
import { ChatOpenAI } from "@langchain/openai";
import { ILLMRepository } from "./ILLMRepository";

export class OpenAILLMRepository implements ILLMRepository {
  private llm: ChatOpenAI;

  constructor(apiKey: string) {
    this.llm = new ChatOpenAI({
      modelName: process.env.MODEL_NAME || "gpt-3.5-turbo",
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY || apiKey,
    });
  }
  getLLM(): ChatOpenAI {
    return this.llm;
  }
}