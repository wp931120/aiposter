import { TextAnalysisResult, LayoutResult, ColorSchemeResult } from '../agents/types';

export const getSVGGeneratorPrompt = (text: string, analysis: TextAnalysisResult, layout: LayoutResult, colorScheme: ColorSchemeResult) => {
  // Defensive programming to ensure analysis and its properties are valid
  if (!analysis || typeof analysis !== 'object') {
    console.error('SVG Generation Error: Invalid analysis object');
    analysis = { sentiment: 'neutral', theme: 'Unknown Theme', keywords: [], structure: { title: 'Error', body: 'Invalid input data' } };
  }
  if (!analysis.keywords || !Array.isArray(analysis.keywords)) {
    analysis.keywords = [];
  }
  if (!colorScheme || typeof colorScheme !== 'object' || !colorScheme.scheme) {
    console.error('SVG Generation Error: Invalid colorScheme object');
    colorScheme = { scheme: 'vibrant' };
  }
  if (!layout || typeof layout !== 'object' || !layout.layout) {
    console.error('SVG Generation Error: Invalid layout object');
    layout = { layout: 'centered' }; // Default layout
  }

  return `
你是一位专业的SVG海报设计师。根据以下设计要求，创建一个视觉上引人注目的海报。

**设计简报:**
- **原始文本:** ${text}
- **主题:** ${analysis.theme}
- **情感:** ${analysis.sentiment}
- **关键词:** ${analysis.keywords.join(', ')}
- **内容:**
  - **标题:** "${analysis.structure.title}"
  - **正文:** "${analysis.structure.body}"
  ${analysis.structure.quote ? `- **引用:** "${analysis.structure.quote}"` : ''}
- **布局:** ${layout.layout}
- **配色:** ${colorScheme.scheme}

**布局指南:**
- **centered:** 核心内容居中 (围绕 x=400, y=300)。
- **split-left-right:** 图文左右分割 (分割线 x=400)。
- **single-focus:** 单一视觉焦点，文字作为点缀。
- **symmetrical:** 沿垂直中心线 (x=400) 对称布局。

**核心要求 (必须遵守):**
1.  **严格的SVG格式:**
    - 必须以 \`<svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">\` 开头。
    - 必须以 \`</svg>\` 结尾。
    - 所有标签必须正确闭合 (例如 \`<path ... />\`)。
    - 所有属性值必须使用双引号 (\`"\`)。
    - SVG代码之外不能有任何文本、注释或Markdown标记。
2.  **设计执行:**
    - **排版:** 字体需清晰易读，尺寸和颜色要与情感和主题匹配。
    - **视觉元素:** 根据情感基调选择图形元素。正面情感使用流畅、有机的形状；负面或严肃主题使用更锐利、几何化的形状。
    - **颜色:** 创造性地使用配色方案，确保文本有足够的可读对比度。
    - **分组:** 使用 \`<g>\` 标签来组织相关的元素。

**输出指令:**
**只输出完整的、有效的、可直接渲染的SVG代码。** 立即从 \`<svg>\` 标签开始。
`;
};