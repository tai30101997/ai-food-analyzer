import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { analyzeFoodPrompt } from "../prompts/analyzeFoodPrompt";
import { getLLMRepository } from "../../llm/llm";
import { LLMSource } from "lib/utils/type";
const llm = getLLMRepository({ source: (process.env.SOURCE) as LLMSource }).getLLM(); // Ensure you have the correct LLM instance
export const analyzeFoodTool = tool(
  async ({ input }) => {
    const prompt = analyzeFoodPrompt.replace("{input}", input);
    const result = await llm.invoke(prompt);
    return result.content;
  },
  {
    name: "analyze_food",
    description: "Phân tích món ăn từ tên và trả về nguyên liệu, calo, và chế độ ăn phù hợp.",
    schema: z.object({
      input: z.string().describe("Tên món ăn cần phân tích, ví dụ 'bún bò Huế'"),
    }),
  }
);