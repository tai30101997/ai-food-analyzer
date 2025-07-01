// lib/agent/detectFoodAgent.ts
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { LLMSource } from "lib/utils/type";
import { detectDishNamePrompt } from "../prompts";
import { OpenAgent } from "./openAgent";

let agent: OpenAgent | null = null;

export async function detectFoodAgent(base64URL: string): Promise<string> {
  if (!agent) {
    agent = new OpenAgent({
      source: (process.env.SOURCE as string) as LLMSource,
      promptTemplate: ChatPromptTemplate.fromTemplate(detectDishNamePrompt.replace("{agent_scratchpad}", "")),
      model: (process.env.OLLAMA_LLAVA_MODEL_NAME) as string || "llava:7b",
    });
  }
  return await agent.invoke(base64URL);
}