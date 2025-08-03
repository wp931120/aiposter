import { LayoutResult, TextAnalysisResult, LayoutType } from './types';
import { BaseAgent } from './BaseAgent';
import { getLayoutPrompt } from '../prompts/layout';
import { LLM } from '../llm';

export class LayoutDesignerAgent extends BaseAgent<TextAnalysisResult, LayoutResult> {
  constructor(llm: LLM) {
    super(llm);
  }
  async execute(analysis: TextAnalysisResult): Promise<LayoutResult> {
    const prompt = getLayoutPrompt(analysis);
    const response = await this.streamLLM(prompt);

    const validLayouts: LayoutType[] = ['centered', 'split-left-right', 'single-focus', 'symmetrical'];
    if (response && validLayouts.includes(response.layout)) {
      return { layout: response.layout };
    } else {
      return { layout: 'centered' };
    }
  }
}