import { ChatPromptTemplate } from "@langchain/core/prompts";
import { LLMSource } from "lib/utils/type";
import { suggestFoodPrompt } from "../prompts/suggestFoodPrompt";
import { suggestFoodTool } from "../tool";
import { OpenAgent } from "./openAgent";

let agent: OpenAgent | null = null;

export async function suggestFoodAgent(userQuery: string): Promise<string> {
  console.log("suggestFoodAgent called with userQuery:", userQuery);
  if (!agent) {
    const prompt = ChatPromptTemplate.fromTemplate(suggestFoodPrompt);
    agent = new OpenAgent({
      source: (process.env.SOURCE as string) as LLMSource,
      promptTemplate: prompt,
      tools: [suggestFoodTool],
    });
  }

  return await agent.invoke(userQuery);
}