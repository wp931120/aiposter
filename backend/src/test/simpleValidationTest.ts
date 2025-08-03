import { SVGGeneratorAgent } from '../agents/SVGGeneratorAgent';
import { LLM } from '../llm';

// 简单的校验测试，不涉及LLM调用
function testValidationOnly() {
  console.log('=== 简化的SVG校验测试 ===\n');
  
  const llm = new LLM();
  const agent = new SVGGeneratorAgent(llm);
  
  const testCases = [
    {
      name: '正常的SVG',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="red"/></svg>',
      expectedValid: true
    },
    {
      name: '缺少结束标签的SVG',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="red"/>',
      expectedValid: false
    },
    {
      name: '标签不匹配的SVG',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g><circle cx="50" cy="50" r="40" fill="red"/></svg>',
      expectedValid: false
    },
    {
      name: '空内容',
      svg: '',
      expectedValid: false
    },
    {
      name: '只有空格',
      svg: '   ',
      expectedValid: false
    }
  ];
  
  let passedTests = 0;
  let totalTests = testCases.length;
  
  for (const testCase of testCases) {
    console.log(`测试: ${testCase.name}`);
    const result = (agent as any).validateSVG(testCase.svg);
    
    const passed = result.isValid === testCase.expectedValid;
    console.log(`结果: ${result.isValid ? '✅ 有效' : '❌ 无效'}`);
    console.log(`预期: ${testCase.expectedValid ? '✅ 有效' : '❌ 无效'}`);
    console.log(`测试: ${passed ? '✅ 通过' : '❌ 失败'}`);
    
    if (!result.isValid && result.errors) {
      console.log('错误信息:');
      result.errors.forEach((error: string, index: number) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
    
    if (passed) {
      passedTests++;
    }
    
    console.log('---\n');
  }
  
  console.log(`\n=== 测试总结 ===`);
  console.log(`通过: ${passedTests}/${totalTests}`);
  console.log(`成功率: ${(passedTests/totalTests*100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有测试通过!');
    process.exit(0);
  } else {
    console.log('❌ 部分测试失败');
    process.exit(1);
  }
}

// 导出测试函数
export { testValidationOnly };

// 如果直接运行此文件
if (require.main === module) {
  testValidationOnly();
}