import { SVGResult, TextAnalysisResult, LayoutResult, ColorSchemeResult } from './types';
import { BaseAgent } from './BaseAgent';
import { getSVGGeneratorPrompt } from '../prompts';
import { LLM } from '../llm';
import { XMLParser } from 'fast-xml-parser';

interface SVGGeneratorInput {
  text: string;
  analysis: TextAnalysisResult;
  layout: LayoutResult;
  colorScheme: ColorSchemeResult;
}

export class SVGGeneratorAgent extends BaseAgent<SVGGeneratorInput, SVGResult> {
  private maxRetries = 3;

  constructor(llm: LLM) {
    super(llm);
  }

  private validateSVG(svgContent: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const trimmed = svgContent.trim();

    if (!trimmed) {
      errors.push('SVG content is empty');
      return { isValid: false, errors };
    }

    if (!trimmed.startsWith('<svg')) {
      errors.push('SVG must start with the <svg tag');
    }

    if (!trimmed.endsWith('</svg>')) {
      errors.push('SVG must end with the </svg> tag');
    }

    const parser = new XMLParser({
      allowBooleanAttributes: true,
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });

    try {
      const result = parser.parse(svgContent);
      if (!result.svg) {
        errors.push('Root element is not <svg>');
      }
    } catch (error: any) {
      errors.push(`XML parsing error: ${error.message}`);
    }

    return { isValid: errors.length === 0, errors };
  }
  

  


  private async generateSVGWithRetry(input: SVGGeneratorInput, attempt: number = 1): Promise<string> {
    const prompt = getSVGGeneratorPrompt(input.text, input.analysis, input.layout, input.colorScheme) + 
      (attempt > 1 ? `\n\n注意：请确保生成完整有效的SVG代码，包含正确的开始和结束标签，以及必要的viewBox或width/height属性。这是第${attempt}次尝试。` : '');

    let rawContent = '';
    
    try {
      // Step 1: Collect the entire LLM output to ensure we have the complete response.
      for await (const chunk of this.streamLLMRaw(prompt)) {
        rawContent += chunk;
      }
      
      // Step 2: Extract the SVG content from the raw output.
      // This handles cases where the model might output extra text before or after the SVG.
      let svgContent = '';
      const svgStartIndex = rawContent.indexOf('<svg');
      if (svgStartIndex === -1) {
        console.warn(`SVGGeneratorAgent: No <svg> tag found in the output. Full output: ${rawContent}`);
        if (attempt < this.maxRetries) {
          return this.generateSVGWithRetry(input, attempt + 1);
        }
        return this.createErrorSvg('SVG生成失败', ['模型未生成<svg>标签']);
      }

      // Find the last closing svg tag.
      const svgEndIndex = rawContent.lastIndexOf('</svg>');
      if (svgEndIndex === -1 || svgEndIndex < svgStartIndex) {
        // If no closing tag, take everything from the start of svg tag.
        // The repair function will attempt to fix it.
        svgContent = rawContent.substring(svgStartIndex);
      } else {
        // Take the content from the first <svg> to the last </svg>.
        svgContent = rawContent.substring(svgStartIndex, svgEndIndex + 6);
      }

      // Step 4: Validate the final SVG.
      const validation = this.validateSVG(svgContent);
      if (!validation.isValid) {
          console.warn(`SVGGeneratorAgent: Invalid SVG after generation. Errors: ${validation.errors.join(', ')}`);
          if (attempt < this.maxRetries) {
              return this.generateSVGWithRetry(input, attempt + 1);
          }
          return this.createErrorSvg('无效的SVG', validation.errors);
      }
      
      return svgContent;
    } catch (error) {
      console.error('SVGGeneratorAgent: An exception occurred during SVG generation:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      if (attempt < this.maxRetries) {
        return this.generateSVGWithRetry(input, attempt + 1);
      }
      return this.createErrorSvg('SVG生成异常', [`系统错误: ${errorMessage}`]);
    }
  }

  async *execute(input: SVGGeneratorInput): AsyncGenerator<string, void, unknown> {
    // 添加防御性编程，确保input和input.analysis包含所有必要的字段
    const svgContent = await this.generateSVGWithRetry(input);
    yield svgContent;
  }
  
  private createErrorSvg(message: string, errors: string[], context?: any): string {
    const errorMessages = errors.map((e, i) => `<text x="40" y="${200 + (i + 1) * 25}" class="message">- ${this.escapeHTML(e.substring(0, 100))}</text>`).join('');
    let contextInfo = '';
    if (context) {
        contextInfo = `<text x="40" y="400" class="context-title">Debug Context:</text>
        <text x="40" y="420" class="context-info">${this.escapeHTML(JSON.stringify(context, null, 2))}</text>`;
    }

    const svgContent = `
<svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title { font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; fill: #dc3545; text-anchor: middle; }
    .message { font-family: Arial, sans-serif; font-size: 14px; fill: #6c757d; }
    .context-title { font-family: Arial, sans-serif; font-size: 16px; fill: #333; }
    .context-info { font-family: monospace; font-size: 12px; fill: #555; white-space: pre; }
  </style>
  <rect width="800" height="600" fill="#f8f9fa"/>
  <rect x="50" y="50" width="700" height="500" fill="#ffffff" stroke="#e9ecef" stroke-width="2" rx="10"/>
  <text x="400" y="150" class="title">${this.escapeHTML(message)}</text>
  ${errorMessages}
  ${contextInfo}
  <text x="400" y="500" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#6c757d">请检查输入内容并重试</text>
</svg>`;
    return svgContent;
  }

  private escapeHTML(str: string): string {
      return str.replace(/[&<>"']/g, (tag) => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
      }[tag] || tag));
  }
}