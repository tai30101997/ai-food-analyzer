// lib/agent/OpenAgent.ts
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable } from "@langchain/core/runnables";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { getLLMRepository } from "lib/llm/llm";
import { handleLLMResponse } from "lib/utils/response";
import { AgentConfig, LLMSource, LLMType } from "lib/utils/type";
import { IOpenAgent } from "./IOpenAgent";
import { HumanMessage } from "@langchain/core/messages";
import { detectDishNamePrompt } from "lib/agent/prompts";
export class OpenAgent implements IOpenAgent {
  private executor: AgentExecutor | null = null;
  private llm: LLMType;
  private prompt: ChatPromptTemplate;
  private tools: any[];
  private source: LLMSource;
  constructor({
    promptTemplate,
    tools = [],
    source = process.env.SOURCE as LLMSource,
    model,
  }: AgentConfig) {
    this.prompt = promptTemplate ?? ChatPromptTemplate.fromTemplate("");
    this.tools = tools;
    this.llm = getLLMRepository({ source, model }).getLLM();
    this.source = source;
  }

  private async invokeWithChain(input: string): Promise<string> {
    const chain: Runnable = this.prompt.pipe(this.llm);
    const result = await chain.invoke({
      input,
      agent_scratchpad: "", // required
    });
    console.log("OpenAgent invokeWithChain result:", result);
    return handleLLMResponse(result);
  }
  public async invokeWithImage(base64Image: string): Promise<string> {
    const finalPrompt = detectDishNamePrompt.replace("{agent_scratchpad}", "");
    const response = await this.llm.invoke([
      new HumanMessage({
        content: [
          {
            type: "text",
            text: finalPrompt,
          },
          {
            type: "image_url",
            image_url: `data:image/jpeg;base64,${base64Image}`,
          },
        ],
      }),
    ]);

    console.log("LLM multimodal response:", response);
    return handleLLMResponse(response);
  }
  private async openAIExecutor(input: string): Promise<string> {
    if (this.executor) {
      const result = await this.executor.invoke({ input });
      return handleLLMResponse({ content: result.output as string });
    }

    const agent = await createOpenAIFunctionsAgent({
      llm: this.llm,
      tools: this.tools,
      prompt: this.prompt,
    });
    this.executor = new AgentExecutor({
      agent,
      tools: this.tools,
    });
    const result = await this.executor.invoke({ input });
    return handleLLMResponse({ content: result.output as string });
  }

  async invoke(input: string): Promise<string> {
    const strategyMap = {
      ollama: this.invokeWithChain.bind(this),
      openai: this.openAIExecutor.bind(this),
      llava: this.invokeWithImage.bind(this),
    };
    const strategy = strategyMap[this.source];
    if (!strategy) throw new Error(`Unsupported LLM source: ${this.source}`);

    return strategy(input);
  }
}