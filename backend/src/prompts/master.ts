export const getMasterAgentPlanPrompt = (text: string) => `
Based on the user's request to generate a poster from the text below, create a step-by-step plan. The plan should be an array of agent names to be executed in sequence. The available agents are: TextAnalyzerAgent, LayoutDesignerAgent, ColorSchemeAgent, SVGGeneratorAgent.

Text: "${text}"

Return a JSON object with the plan in the 'plan' field, which should be an array of strings.
`;