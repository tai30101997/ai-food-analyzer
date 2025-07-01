// lib/llm/LLMFactory.ts
import { LLMConfig } from "lib/utils/type";
import { OllamaLLMRepository } from "./OllamaLLMRepository";
import { OpenAILLMRepository } from "./OpenAILLMRepository";
import { ILLMRepository } from "./ILLMRepository";

export function getLLMRepository(input: LLMConfig): ILLMRepository {
  const { source, apiKey, model, } = input;
  if (source === "openai") {
    if (!apiKey) throw new Error("OpenAI API key required");
    return new OpenAILLMRepository(apiKey);
  }
  return new OllamaLLMRepository({
    model: input.model,
  });
}
