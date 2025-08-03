import { ColorSchemeResult, TextAnalysisResult, ColorSchemeType } from './types';
import { BaseAgent } from './BaseAgent';
import { getColorSchemePrompt } from '../prompts';
import { LLM } from '../llm';

export class ColorSchemeAgent extends BaseAgent<TextAnalysisResult, ColorSchemeResult> {
  constructor(llm: LLM) {
    super(llm);
  }
  async execute(analysis: TextAnalysisResult): Promise<ColorSchemeResult> {
    const prompt = getColorSchemePrompt(analysis);
    const response = await this.streamLLM(prompt);

    const validSchemes: ColorSchemeType[] = ['vibrant', 'pastel', 'monochromatic'];
    if (response && validSchemes.includes(response.scheme)) {
      return { scheme: response.scheme };
    } else {
      return { scheme: 'vibrant' };
    }
  }
}