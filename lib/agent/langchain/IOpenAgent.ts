export interface IOpenAgent {
  invoke(input: string): Promise<string>;
}