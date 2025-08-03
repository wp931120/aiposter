import { TextAnalyzerAgent } from './TextAnalyzerAgent';
import { LayoutDesignerAgent } from './LayoutDesignerAgent';
import { ColorSchemeAgent } from './ColorSchemeAgent';
import { SVGGeneratorAgent } from './SVGGeneratorAgent';

import { LLM } from '../llm';
import { getMasterAgentPlanPrompt } from '../prompts';
import { log } from 'console';

export class MasterAgent {
  private llm: LLM;
  private agents: {
    [key: string]:
      | TextAnalyzerAgent
      | LayoutDesignerAgent
      | ColorSchemeAgent
      | SVGGeneratorAgent;
  };

  constructor() {
    this.llm = new LLM();
    this.agents = {
      TextAnalyzerAgent: new TextAnalyzerAgent(this.llm),
      LayoutDesignerAgent: new LayoutDesignerAgent(this.llm),
      ColorSchemeAgent: new ColorSchemeAgent(this.llm),
      SVGGeneratorAgent: new SVGGeneratorAgent(this.llm),
    };
  }

  async *processRequestWithProgress(text: string): AsyncGenerator<{type: 'progress' | 'svg', data: any}, void, unknown> {
    const planPrompt = getMasterAgentPlanPrompt(text);
    console.log('MasterAgent: Calling LLM for plan...');
    
    // 发送初始进度
    yield { type: 'progress', data: { stage: '分析规划', percentage: 0, description: '正在分析文本内容并制定生成计划...' } };
    
    let planResponse = '';
    for await (const chunk of this.llm.stream(planPrompt)) {
      planResponse += chunk;
    }
    console.log('MasterAgent: Received plan response:', planResponse);
    let plan;
    try {
      const jsonPlan = this.extractJsonFromMarkdown(planResponse);
      plan = JSON.parse(jsonPlan).plan;
      if (!Array.isArray(plan)) {
        throw new Error('Plan is not an array.');
      }
    } catch (error) {
      console.error('MasterAgent: Error parsing plan, using default plan.', error);
      plan = ['TextAnalyzerAgent', 'LayoutDesignerAgent', 'ColorSchemeAgent', 'SVGGeneratorAgent'];
    }

    yield { type: 'progress', data: { stage: '分析规划', percentage: 20, description: '生成计划制定完成，准备执行各个代理...' } };

    let context: any = { text };
    const totalAgents = plan.length;
    let currentAgentIndex = 0;

    for (const agentName of plan) {
      const agent = this.agents[agentName as keyof typeof this.agents];
      if (!agent) {
        throw new Error(`Agent ${agentName} not found`);
      }

      const basePercentage = 20 + (currentAgentIndex / totalAgents) * 60;
      const agentPercentage = 60 / totalAgents;
      
      // 发送代理开始执行的进度
      yield { type: 'progress', data: { 
        stage: this.getAgentStageName(agentName), 
        percentage: Math.round(basePercentage), 
        description: this.getAgentDescription(agentName) 
      } };

      const input = this.mapInput(agentName, context);

      if (agent instanceof SVGGeneratorAgent) {
        yield { type: 'progress', data: { 
          stage: 'SVG生成', 
          percentage: Math.round(basePercentage + agentPercentage * 0.3), 
          description: '正在生成SVG代码...' 
        } };
        
        let svgContent = '';
        const stream = agent.execute(input as any);
        for await (const chunk of stream) {
            svgContent += chunk;
            yield { type: 'svg', data: chunk };
        }
        this.updateContext(agentName, svgContent, context);
        
        yield { type: 'progress', data: { 
          stage: 'SVG生成', 
          percentage: Math.round(basePercentage + agentPercentage), 
          description: 'SVG生成完成' 
        } };
      } else {
        const result = await agent.execute(input as any);
        this.updateContext(agentName, result, context);
        
        yield { type: 'progress', data: { 
          stage: this.getAgentStageName(agentName), 
          percentage: Math.round(basePercentage + agentPercentage), 
          description: `${this.getAgentStageName(agentName)}完成` 
        } };
      }
      
      currentAgentIndex++;
    }
    
    yield { type: 'progress', data: { stage: '完成', percentage: 100, description: '海报生成完成！' } };
    console.info('MasterAgent: Final context:', context);
    return context.finalResult;
  }

  async *processRequest(text: string): AsyncGenerator<string, void, unknown> {
    const planPrompt = getMasterAgentPlanPrompt(text);
    console.log('MasterAgent: Calling LLM for plan...');
    let planResponse = '';
    for await (const chunk of this.llm.stream(planPrompt)) {
      planResponse += chunk;
    }
    console.log('MasterAgent: Received plan response:', planResponse);
    let plan;
    try {
      const jsonPlan = this.extractJsonFromMarkdown(planResponse);
      plan = JSON.parse(jsonPlan).plan;
      if (!Array.isArray(plan)) {
        throw new Error('Plan is not an array.');
      }
    } catch (error) {
      console.error('MasterAgent: Error parsing plan, using default plan.', error);
      plan = ['TextAnalyzerAgent', 'LayoutDesignerAgent', 'ColorSchemeAgent', 'SVGGeneratorAgent'];
    }

    let context: any = { text };

    for (const agentName of plan) {
      const agent = this.agents[agentName as keyof typeof this.agents];
      if (!agent) {
        throw new Error(`Agent ${agentName} not found`);
      }

      const input = this.mapInput(agentName, context);

      if (agent instanceof SVGGeneratorAgent) {
        let svgContent = '';
        const stream = agent.execute(input as any);
        for await (const chunk of stream) {
            svgContent += chunk;
            yield chunk;
        }
        this.updateContext(agentName, svgContent, context);
      } else {
        const result = await agent.execute(input as any);
        console.info(`MasterAgent: ${agentName} result:`, result);
        this.updateContext(agentName, result, context);
      }
    }
    console.info('MasterAgent: Final context:', context);
    return context.finalResult;
  }

  private extractJsonFromMarkdown(markdown: string): string {
    const jsonRegex = /```json\n([\s\S]*?)\n```/;
    const match = markdown.match(jsonRegex);
    if (match && match[1]) {
      return match[1];
    }
    return markdown; // Fallback to the original response if no markdown block is found
  }

  private mapInput(agentName: string, context: any): any {
    // 添加防御性编程，确保context是有效的对象
    if (!context || typeof context !== 'object') {
      console.error(`MasterAgent: 无效的context对象传递给${agentName}`);
      context = {};
    }
    
    switch (agentName) {
      case 'TextAnalyzerAgent':
        return { text: context.text || '' };
      case 'LayoutDesignerAgent':
        // 确保analysis对象存在
        if (!context.analysis || typeof context.analysis !== 'object') {
          console.error('MasterAgent: 传递给LayoutDesignerAgent的analysis无效');
          context.analysis = { 
            sentiment: 'neutral', 
            theme: '未知主题', 
            keywords: [], 
            structure: { title: '错误', body: '无效的输入数据' } 
          };
        }
        return { analysis: context.analysis };
      case 'ColorSchemeAgent':
        // 确保analysis和layout对象存在
        if (!context.analysis || typeof context.analysis !== 'object') {
          console.error('MasterAgent: 传递给ColorSchemeAgent的analysis无效');
          context.analysis = { 
            sentiment: 'neutral', 
            theme: '未知主题', 
            keywords: [], 
            structure: { title: '错误', body: '无效的输入数据' } 
          };
        }
        if (!context.layout || typeof context.layout !== 'object') {
          console.error('MasterAgent: 传递给ColorSchemeAgent的layout无效');
          context.layout = { 
            title: '错误', 
            subtitle: '', 
            sections: [], 
            visualElements: [] 
          };
        }
        return { analysis: context.analysis, layout: context.layout };
      case 'SVGGeneratorAgent':
        // 确保所有必要的对象都存在
        if (!context.analysis || typeof context.analysis !== 'object') {
          console.error('MasterAgent: 传递给SVGGeneratorAgent的analysis无效');
          context.analysis = { 
            sentiment: 'neutral', 
            theme: '未知主题', 
            keywords: [], 
            structure: { title: '错误', body: '无效的输入数据' } 
          };
        }
        if (!context.layout || typeof context.layout !== 'object') {
          console.error('MasterAgent: 传递给SVGGeneratorAgent的layout无效');
          context.layout = { 
            title: '错误', 
            subtitle: '', 
            sections: [], 
            visualElements: [] 
          };
        }
        if (!context.colorScheme || typeof context.colorScheme !== 'object') {
          console.error('MasterAgent: 传递给SVGGeneratorAgent的colorScheme无效');
          context.colorScheme = { 
            primary: '#333333', 
            secondary: '#666666', 
            accent: '#999999', 
            background: '#ffffff', 
            text: '#000000' 
          };
        }
        return { text: context.text, analysis: context.analysis, layout: context.layout, colorScheme: context.colorScheme };
      default:
        throw new Error(`Unknown agent for input mapping: ${agentName}`);
    }
  }

  private updateContext(agentName: string, result: any, context: any): void {
    switch (agentName) {
      case 'TextAnalyzerAgent':
        context.analysis = result;
        break;
      case 'LayoutDesignerAgent':
        context.layout = result;
        break;
      case 'ColorSchemeAgent':
        context.colorScheme = result;
        break;
      case 'SVGGeneratorAgent':
        context.svg = result;
        context.finalResult = result;
        break;
      default:
        throw new Error(`Unknown agent for context update: ${agentName}`);
    }
  }

  private getAgentStageName(agentName: string): string {
    switch (agentName) {
      case 'TextAnalyzerAgent':
        return '文本分析';
      case 'LayoutDesignerAgent':
        return '布局设计';
      case 'ColorSchemeAgent':
        return '配色方案';
      case 'SVGGeneratorAgent':
        return 'SVG生成';
      default:
        return agentName;
    }
  }

  private getAgentDescription(agentName: string): string {
    switch (agentName) {
      case 'TextAnalyzerAgent':
        return '正在分析文本内容，提取关键信息和主题...';
      case 'LayoutDesignerAgent':
        return '正在设计海报布局，确定元素位置和排版...';
      case 'ColorSchemeAgent':
        return '正在选择配色方案，确定主色调和辅助色...';
      case 'SVGGeneratorAgent':
        return '正在生成SVG代码，创建最终的海报...';
      default:
        return `正在执行 ${agentName}...`;
    }
  }
}