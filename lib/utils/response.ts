import { HandlerStrategy, LLMResponse } from "./type";

const stringHandler: HandlerStrategy = {
  canHandle: (response) => typeof response.content === "string",
  handle: (response) => response.content,
};

const arrayHandler: HandlerStrategy = {
  canHandle: (response) => Array.isArray(response.content),
  handle: (response) =>
    response.content
      .map((item: any) =>
        typeof item === "string" ? item : item?.text ?? ""
      )
      .join(" "),
};

const fallbackHandler: HandlerStrategy = {
  canHandle: () => true,
  handle: (response) => JSON.stringify(response.content),
};

const handlers: HandlerStrategy[] = [stringHandler, arrayHandler, fallbackHandler];

/**
 * Unified handler to deal with LLM responses (Ollama / OpenAI)
 */

export function handleLLMResponse(response: LLMResponse): string {
  for (const handler of handlers) {
    if (handler.canHandle(response)) {
      return handler.handle(response);
    }
  }
  return "";
}