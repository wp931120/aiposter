"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSVGGeneratorPrompt = void 0;
const getSVGGeneratorPrompt = (analysis, layout, colorScheme) => {
    const sentimentStyles = {
        positive: {
            mood: '充满活力和乐观',
            visualElements: '明亮的渐变、上升的线条、圆润的形状',
            typography: '现代、清晰、友好的字体',
            shapes: '圆形、椭圆、波浪线、星形',
            patterns: '点状装饰、放射状图案、流动曲线',
            errorPrevention: '避免过于复杂的路径，确保颜色对比度足够'
        },
        negative: {
            mood: '深沉和内省',
            visualElements: '深色调、几何形状、简洁的线条',
            typography: '严肃、稳重的字体',
            shapes: '矩形、直线、三角形、多边形',
            patterns: '网格图案、条纹、几何重复',
            errorPrevention: '保持简洁性，避免过度装饰'
        },
        neutral: {
            mood: '平衡和专业',
            visualElements: '对称的布局、中性的形状、平衡的构图',
            typography: '清晰、易读的字体',
            shapes: '圆角矩形、椭圆、简单几何形',
            patterns: '简洁装饰、对称图案、渐变效果',
            errorPrevention: '确保所有元素对齐，保持视觉平衡'
        }
    };
    const currentSentiment = sentimentStyles[analysis.sentiment];
    return `你是一位世界级的SVG设计师和视觉艺术家。你的任务是创建一个令人惊艳的专业海报，完美捕捉提供内容的精髓。

**设计简报:**
主题: ${analysis.theme}
情感基调: ${analysis.sentiment} (${currentSentiment.mood})
关键词: ${analysis.keywords.join(', ')}
标题: "${analysis.structure.title}"
正文: "${analysis.structure.body}"
${analysis.structure.quote ? `引用: "${analysis.structure.quote}"` : ''}

布局风格: ${layout.name} - ${layout.description}
配色方案: ${colorScheme.name}
主要颜色: ${colorScheme.colors.join(', ')}

**设计要求:**
1. **视觉层次**: 使用尺寸、颜色和位置创建清晰的焦点
2. **排版设计**: ${currentSentiment.typography}
3. **色彩应用**: 战略性地应用配色方案以获得最大视觉冲击
4. **构图平衡**: 基于提供的布局创建平衡的元素排列
5. **视觉元素**: ${currentSentiment.visualElements}
6. **专业品质**: 确保设计看起来精致且适合发布

**关键SVG格式要求:**
- 必须以此开头: <svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
- 必须以此结尾: </svg>
- 所有属性必须使用双引号，绝不使用单引号
- 所有标签必须正确闭合（自闭合标签以 /> 结尾）
- SVG标签外不得有任何文本
- 不使用markdown格式或代码块
- SVG前后不得有解释性文本
- 全程使用正确的XML语法

**技术规范（必须严格遵守）:**
- 使用 viewBox="0 0 800 600" 确保一致的缩放
- 包含带有 font-family、font-size 和 fill 属性的正确文本元素
- 适当添加渐变、阴影或图案以增加视觉趣味
- 确保所有文本具有适当对比度且可读
- 使用 <g> 元素进行语义分组
- 如果能增强设计，包含微妙的背景或纹理
- 所有颜色必须是有效的CSS颜色值（十六进制、rgb或命名颜色）
- 所有数值必须是有效数字，除非需要单位
- 总文件大小不超过50KB，避免过度复杂的路径
- 所有标签必须正确配对和闭合
- 自闭合标签必须以 /> 结尾
- 所有属性值必须使用双引号，绝不使用单引号
- 必须包含xmlns="http://www.w3.org/2000/svg"命名空间声明

**创意指导:**
- 创造性地诠释主题，同时忠于内容
- 使用情感基调指导整体氛围和能量
- 通过排版或象征元素视觉化地融入关键词
- 通过分层和视觉效果增加深度和维度
- 考虑现代设计趋势，同时保持永恒的吸引力
- 推荐形状: ${currentSentiment.shapes}
- 装饰图案: ${currentSentiment.patterns}
- 错误预防: ${currentSentiment.errorPrevention}

**设计要求:**
1. **视觉层次**: 使用尺寸、颜色和位置创建清晰的焦点
2. **排版设计**: 现代、清晰、友好的字体
3. **色彩应用**: 战略性地应用配色方案以获得最大视觉冲击
4. **构图平衡**: 基于提供的布局创建平衡的元素排列
5. **视觉元素**: 明亮的渐变、上升的线条、圆润的形状
6. **专业品质**: 确保设计看起来精致且适合发布

**关键SVG格式要求:**
- 必须以此开头: <svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
- 必须以此结尾: </svg>
- 所有属性必须使用双引号，绝不使用单引号
- 所有标签必须正确闭合（自闭合标签以 /> 结尾）
- SVG标签外不得有任何文本
- 不使用markdown格式或代码块
- SVG前后不得有解释性文本
- 全程使用正确的XML语法

**技术规范（必须严格遵守）:**
- 使用 viewBox="0 0 600 800" 确保一致的缩放
- 包含带有 font-family、font-size 和 fill 属性的正确文本元素
- 适当添加渐变、阴影或图案以增加视觉趣味
- 确保所有文本具有适当对比度且可读
- 使用 <g> 元素进行语义分组
- 如果能增强设计，包含微妙的背景或纹理
- 所有颜色必须是有效的CSS颜色值（十六进制、rgb或命名颜色）
- 所有数值必须是有效数字，除非需要单位
- 总文件大小不超过50KB，避免过度复杂的路径
- 所有标签必须正确配对和闭合
- 自闭合标签必须以 /> 结尾
- 所有属性值必须使用双引号，绝不使用单引号
- 必须包含xmlns="http://www.w3.org/2000/svg"命名空间声明

**创意指导:**
- 创造性地诠释主题，同时忠于内容
- 使用情感基调指导整体氛围和能量
- 通过排版或象征元素视觉化地融入关键词
- 通过分层和视觉效果增加深度和维度
- 考虑现代设计趋势，同时保持永恒的吸引力
- 推荐形状: 圆形、椭圆、波浪线、星形
- 装饰图案: 点状装饰、放射状图案、流动曲线
- 错误预防: 避免过于复杂的路径，确保颜色对比度足够

**严格输出格式:**
你必须只输出有效的SVG代码。不得有其他文本、解释或格式。
立即以 <svg 开始，以 </svg> 结束。

**重要提醒:**
生成的SVG必须是完整、有效、可直接使用的代码。任何语法错误都会导致显示失败。请特别注意标签闭合、 属性格式和命名空间声明。

**你的任务:**
创建一个视觉上令人惊艳的海报，通过卓越的设计将内容生动呈现。严格按照所有技术规范和质量要求，确保输出的SVG代码完全有效且可直接使用。**只输出完整的SVG代码，不要包含任何其他文字、说明或代码块标记。
`;
};
exports.getSVGGeneratorPrompt = getSVGGeneratorPrompt;
