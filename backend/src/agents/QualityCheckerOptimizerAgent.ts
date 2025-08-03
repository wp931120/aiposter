import { QualityCheckResult, SVGResult } from './types';
import { BaseAgent } from './BaseAgent';
import { getQualityCheckerPrompt } from '../prompts';
import { LLM } from '../llm';

export class QualityCheckerOptimizerAgent extends BaseAgent<SVGResult, QualityCheckResult> {
  constructor(llm: LLM) {
    super(llm);
  }

  async execute(svgResult: SVGResult): Promise<QualityCheckResult> {
    const prompt = getQualityCheckerPrompt(svgResult.svgCode);
    const response = await this.streamLLM(prompt);
    return response;
  }
}