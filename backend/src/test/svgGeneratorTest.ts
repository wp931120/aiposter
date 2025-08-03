import { SVGGeneratorAgent } from '../agents/SVGGeneratorAgent';
import { TextAnalysisResult, LayoutResult, ColorSchemeResult } from '../agents/types';
import { LLM } from '../llm';

// 测试数据
const mockTextAnalysis: TextAnalysisResult = {
  keywords: ['人工智能', '未来', '创新', '科技'],
  theme: '创新科技',
  sentiment: 'positive' as const,
  structure: { title: '创新科技', body: '探索人工智能技术在未来社会中的创新应用和发展前景' }
};

const mockLayout: LayoutResult = {
  layoutId: 'centered-layout',
  name: '居中布局',
  description: '内容居中显示的布局',
  preview: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='
};

const mockColorScheme: ColorSchemeResult = {
  schemeId: 'blue-scheme',
  name: '蓝色主题',
  colors: ['#2563eb', '#3b82f6', '#06b6d4', '#f8fafc', '#1e293b']
};

// 测试用例
const testCases = [
  {
    name: '正常SVG测试',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <title>测试SVG</title>
  <rect width="100%" height="100%" fill="#f8fafc" />
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="#1e293b">测试文本</text>
</svg>`
  },
  {
    name: '缺少命名空间的SVG',
    svg: `<svg viewBox="0 0 800 600">
  <rect width="100%" height="100%" fill="#f8fafc" />
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="#1e293b">测试文本</text>
</svg>`
  },
  {
    name: '标签不匹配的SVG',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <g>
  <rect width="100%" height="100%" fill="#f8fafc" />
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="#1e293b">测试文本</text>
</svg>`
  },
  {
    name: '无效颜色值的SVG',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="invalid-color" />
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="#1e293b">测试文本</text>
</svg>`
  },
  {
    name: '包含脚本的SVG（安全测试）',
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <script>alert('xss')</script>
  <rect width="100%" height="100%" fill="#f8fafc" />
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="#1e293b">测试文本</text>
</svg>`
  },
  {
    name: '空SVG测试',
    svg: ''
  }
];

async function testSVGValidation() {
  console.log('=== SVG校验功能测试 ===\n');
  
  const llm = new LLM();
  const agent = new SVGGeneratorAgent(llm);
  
  for (const testCase of testCases) {
    console.log(`测试用例: ${testCase.name}`);
    
    // 使用私有方法测试（需要类型断言）
    const result = (agent as any).validateSVG(testCase.svg);
    
    console.log(`结果: ${result.isValid ? '✅ 有效' : '❌ 无效'}`);
    if (!result.isValid) {
      console.log('错误信息:');
      result.errors.forEach((error: string, index: number) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    console.log('---\n');
  }
}

async function testSVGGeneration() {
  console.log('=== SVG生成功能测试 ===\n');
  
  const llm = new LLM();
  const agent = new SVGGeneratorAgent(llm);
  
  try {
    console.log('开始生成SVG...');
    
    // 创建输入对象
    const input = {
      analysis: mockTextAnalysis,
      layout: mockLayout,
      colorScheme: mockColorScheme
    };
    
    // 收集流式输出
    let svgContent = '';
    const generator = agent.execute(input);
    
    for await (const chunk of generator) {
      svgContent += chunk;
    }
    
    console.log('生成结果:');
    console.log(`- SVG长度: ${svgContent.length} 字符`);
    console.log(`- 内容预览: ${svgContent.substring(0, 100)}...`);
    
    // 验证生成的SVG
    const validation = (agent as any).validateSVG(svgContent);
    console.log(`\n最终校验结果: ${validation.isValid ? '✅ 有效' : '❌ 无效'}`);
    
    if (!validation.isValid) {
      console.log('最终校验错误:');
      validation.errors.forEach((error: string, index: number) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ SVG生成成功且通过所有校验!');
    }
    
  } catch (error) {
    console.error('生成过程中发生错误:', error);
  }
}

async function runAllTests() {
  await testSVGValidation();
  await testSVGGeneration();
}

// 导出测试函数
export {
  testSVGValidation,
  testSVGGeneration,
  runAllTests
};

// 如果直接运行此文件
if (require.main === module) {
  runAllTests().catch(console.error);
}