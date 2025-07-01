import { ChatPromptTemplate } from "@langchain/core/prompts";
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
export interface AgentConfig {
  promptTemplate?: ChatPromptTemplate;
  tools?: any[]; // hoặc cụ thể hơn nếu bạn đã define type tools
  source?: LLMSource; // 'ollama' | 'openai'
  model?: string;
}
export interface LLMConfig {
  source: LLMSource;
  apiKey?: string; // only use for openai
  model?: string; // model name
}
export type LLMType = ChatOllama | ChatOpenAI;