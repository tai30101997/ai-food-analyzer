// lib/agent/OpenAgent.ts
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable } from "@langchain/core/runnables";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { getLLMRepository } from "lib/llm/llm";
import { handleLLMResponse } from "lib/utils/response";
import { LLMSource, LLMType } from "lib/utils/type";
import { IOpenAgent } from "./IOpenAgent";

export class OpenAgent implements IOpenAgent {
  private executor: AgentExecutor | null = null;
  private llm: LLMType;
  private prompt: ChatPromptTemplate;
  private tools: any[];
  private source: LLMSource;
  constructor({
    promptTemplate,
    tools = [],
    source = (process.env.SOURCE as LLMSource), // or 'openai'
  }: {
    promptTemplate: ChatPromptTemplate;
    tools?: any;
    source?: LLMSource;
  }) {
    this.prompt = promptTemplate;
    this.tools = tools;
    this.llm = getLLMRepository({ source }).getLLM();
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
    };
    const strategy = strategyMap[this.source];
    if (!strategy) throw new Error(`Unsupported LLM source: ${this.source}`);

    return strategy(input);
  }
}