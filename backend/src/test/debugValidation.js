const { SVGGeneratorAgent } = require('../../dist/agents/SVGGeneratorAgent');
const { LLM } = require('../../dist/llm');

const llm = new LLM();
const agent = new SVGGeneratorAgent(llm);

const testSvg = `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <g>
  <rect width="100%" height="100%" fill="#f8fafc" />
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="#1e293b">测试文本</text>
</svg>`;

console.log('测试SVG:');
console.log(testSvg);
console.log('\n校验结果:');
const result = agent.validateSVG(testSvg);
console.log('结果:', result.isValid ? '有效' : '无效');
if (!result.isValid) {
  console.log('错误信息:');
  result.errors.forEach((error, index) => {
    console.log(`  ${index + 1}. ${error}`);
  });
}