import { TextAnalysisResult } from '../agents/types';

export const getLayoutPrompt = (analysis: TextAnalysisResult) => `
You are a professional graphic designer. Your task is to choose a layout for a poster based on the provided text analysis. Choose one of the following layouts: 'centered' (居中构图), 'split-left-right' (左右图文), 'single-focus' (单图聚焦), or 'symmetrical' (对称构图).

**Text Analysis:**
- Theme: ${analysis.theme || 'Unknown'}
- Sentiment: ${analysis.sentiment || 'neutral'}
- Keywords: ${analysis.keywords ? analysis.keywords.join(', ') : 'None'}

**Instructions:**
1.  Analyze the text's theme, sentiment, and keywords.
2.  Choose the most appropriate layout from the options: 'centered', 'split-left-right', 'single-focus', 'symmetrical'.
3.  Return your response as a single, valid JSON object with a single key "layout".

**Your Task:**
Based on the analysis provided below, generate the JSON response.

`;