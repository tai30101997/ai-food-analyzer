// lib/agent/analyzeFoodAgent.ts
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { LLMSource } from "lib/utils/type";
import { analyzeFoodPrompt } from "../prompts";
import { analyzeFoodTool } from "../tool";
import { OpenAgent } from "./openAgent";

let agent: OpenAgent | null = null;

export async function analyzeFoodAgent(dishName: string): Promise<string> {
  if (!agent) {
    agent = new OpenAgent({
      source: (process.env.SOURCE as string) as LLMSource,
      promptTemplate: ChatPromptTemplate.fromTemplate(analyzeFoodPrompt),
      tools: [analyzeFoodTool],
    });
  }
  return await agent.invoke(dishName);
}