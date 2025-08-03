"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayoutPrompt = void 0;
const getLayoutPrompt = (analysis) => `
You are a professional graphic designer specializing in poster layouts. Your task is to design a layout based on the provided text analysis. The layout should be visually appealing and effectively communicate the text's core message.

**Text Analysis:**
- Theme: ${analysis.theme || 'Unknown'}
- Sentiment: ${analysis.sentiment || 'neutral'}
- Keywords: ${analysis.keywords ? analysis.keywords.join(', ') : 'None'}

**Instructions:**
1.  Analyze the text's theme, sentiment, and keywords to determine the most effective layout structure.
2.  Decide whether to use the \`get_layout_templates\` tool to find a suitable pre-defined layout or to create a custom layout from scratch.
    - Use the tool for common themes where standard layouts work well (e.g., 'event announcement', 'product promotion').
    - Create a custom layout for more creative or unconventional topics.
3.  Return your response as a single, valid JSON object. **Do not add any text outside the JSON object.**

**Output Format:**

*   **If using the tool:**
    Your JSON should contain a "tool" field with the value "get_layout_templates" and a "tool_input" field with the arguments for the tool (e.g., \`{ "theme": "${analysis.theme || 'general'}" }\`).

    *Example:*
    \`\`\`json
    {
      "tool": "get_layout_templates",
      "tool_input": {
        "theme": "conference"
      }
    }
    \`\`\`

*   **If creating a custom layout:**
    Your JSON should contain a "layout" field, which is an object describing the layout structure. It must include a 'layoutId', a 'name', and a 'structure' detailing the placement of elements like 'title', 'text', and 'image'.

    *Example:*
    \`\`\`json
    {
      "layout": {
        "layoutId": "custom-layout-1",
        "name": "Modern Minimalist",
        "structure": {
          "title": { "position": "top-center", "fontSize": "large" },
          "text": { "position": "middle-center", "fontSize": "medium" },
          "image": { "position": "bottom-center", "size": "full-width" }
        }
      }
    }
    \`\`\`

**Your Task:**
Based on the analysis provided below, generate the JSON response.

**Text Analysis for this task:**
${JSON.stringify(analysis, null, 2)}
`;
exports.getLayoutPrompt = getLayoutPrompt;
