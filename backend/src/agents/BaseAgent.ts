import { LLM } from '../llm';
import { Agent } from './types';

export abstract class BaseAgent<T, U> implements Agent<T, U> {
  protected llm: LLM;

  constructor(llm: LLM) {
    this.llm = llm;
  }


  abstract execute(input: T): Promise<U> | AsyncGenerator<string, void, unknown>;

  protected async streamLLM(prompt: string): Promise<any> {
    console.log('--- Calling streamLLM ---');
    let response = '';
    for await (const chunk of this.llm.stream(prompt)) {
      response += chunk;
    }

    try {
      const jsonResponse = this.extractJsonFromMarkdown(response);
      return JSON.parse(jsonResponse);
    } catch (error) {
      // If parsing fails, return the raw response
      return response;
    }
  }

  private extractJsonFromMarkdown(markdown: string): string {
    const jsonRegex = /```json\n([\s\S]*?)\n```/;
    const match = markdown.match(jsonRegex);
    if (match && match[1]) {
      return match[1];
    }
    return markdown; // Fallback to the original response if no markdown block is found
  }

  protected async *streamLLMRaw(prompt: string): AsyncGenerator<string, void, unknown> {
    console.log('--- Calling streamLLMRaw ---');
    for await (const chunk of this.llm.stream(prompt)) {
        yield chunk;
    }
  }
}