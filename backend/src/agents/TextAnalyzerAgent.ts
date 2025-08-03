import { TextAnalysisResult } from './types';
import { BaseAgent } from './BaseAgent';
import { getTextAnalyzerPrompt } from '../prompts';


import { LLM } from '../llm';

export class TextAnalyzerAgent extends BaseAgent<{ text: string }, TextAnalysisResult> {
  constructor(llm: LLM) {
    super(llm);
  }

    async execute(input: { text: string }): Promise<TextAnalysisResult> {
    const { text } = input;
    const prompt = getTextAnalyzerPrompt(text);
    const response = await this.streamLLM(prompt);
    
    // 添加防御性编程，确保返回的结果符合预期格式
    const validatedResponse: TextAnalysisResult = {
      keywords: Array.isArray(response.keywords) ? response.keywords : ['内容', '分析'],
      theme: typeof response.theme === 'string' ? response.theme : '未知主题',
      sentiment: ['positive', 'negative', 'neutral'].includes(response.sentiment) ? response.sentiment : 'neutral',
      structure: {
        title: typeof response.structure?.title === 'string' ? response.structure.title : '未命名',
        body: typeof response.structure?.body === 'string' ? response.structure.body : text.substring(0, 100),
        quote: typeof response.structure?.quote === 'string' ? response.structure.quote : undefined
      }
    };
    
    return validatedResponse;
  }
}