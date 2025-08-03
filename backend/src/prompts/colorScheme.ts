import { TextAnalysisResult } from '../agents/types';

export const getColorSchemePrompt = (analysis: TextAnalysisResult) => `
You are a color theorist. Your task is to choose a color scheme for a poster based on the provided text analysis. Choose one of the following schemes: 'vibrant', 'pastel', or 'monochromatic'.

**Text Analysis:**
- Theme: ${analysis.theme || 'Unknown'}
- Sentiment: ${analysis.sentiment || 'neutral'}

**Instructions:**
1.  Analyze the text's theme and sentiment.
2.  Choose the most appropriate color scheme from the options: 'vibrant', 'pastel', 'monochromatic'.
3.  Return your response as a single, valid JSON object with a single key "scheme".

**Output Format Example:**
\`\`\`json
{
  "scheme": "vibrant"
}
\`\`\`

**Your Task:**
Based on the analysis provided below, generate the JSON response.

**Text Analysis for this task:**
${JSON.stringify(analysis, null, 2)}
`;