// lib/llm/ILLMRepository.ts
export interface ILLMRepository {
  getLLM(): any; // Return type should be the specific LLM instance type, e.g., ChatOpenAI or ChatOllama
}
