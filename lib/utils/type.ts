import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";

export type LLMResponse = {
  content?: any;
};

export type HandlerStrategy = {
  canHandle: (response: LLMResponse) => boolean;
  handle: (response: LLMResponse) => string;
};

export type LLMSource = "ollama" | "openai";

export interface LLMConfig {
  source: LLMSource;
  apiKey?: string; // chỉ dùng cho openai
}
export type LLMType = ChatOllama | ChatOpenAI;