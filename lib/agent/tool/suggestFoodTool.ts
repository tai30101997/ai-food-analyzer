import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { suggestFoodPrompt } from "../prompts/suggestFoodPrompt";
import { getLLMRepository } from "../../llm/llm"; // Import the llm instance from openai.ts
import { LLMSource } from "lib/utils/type";
const llm = getLLMRepository({ source: (process.env.SOURCE) as LLMSource }).getLLM();

export const suggestFoodTool = tool(
  async ({ input }) => {
    const prompt = suggestFoodPrompt.replace("{input}", input);
    const result = await llm.invoke(prompt);
    return result.content;
  },
  {
    name: "suggest_food",
    description: "Gợi ý món ăn phù hợp dựa trên yêu cầu hoặc ngữ cảnh người dùng (VD: trời mưa, muốn ăn cay...).",
    schema: z.object({
      input: z.string().describe("Yêu cầu hoặc ngữ cảnh của người dùng."),
    }),
  }
);