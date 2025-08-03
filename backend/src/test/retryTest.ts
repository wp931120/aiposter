import { LLM } from '../llm';

async function testRetryMechanism() {
  console.log('Testing LLM retry mechanism...');
  
  const llm = new LLM();
  
  try {
    console.log('\n=== Test 1: Normal SVG generation ===');
    const svgPrompt = '请生成一个简单的蓝色圆形SVG';
    let result = '';
    
    for await (const chunk of llm.stream(svgPrompt)) {
      result += chunk;
    }
    
    console.log('SVG Result:', result);
    console.log('SVG Test completed successfully');
    
    console.log('\n=== Test 2: Code generation ===');
    const codePrompt = '请生成一个简单的JavaScript函数';
    let codeResult = '';
    
    for await (const chunk of llm.stream(codePrompt)) {
      codeResult += chunk;
    }
    
    console.log('Code Result:', codeResult);
    console.log('Code Test completed successfully');
    
    console.log('\n=== Test 3: General query ===');
    const generalPrompt = '你好，请介绍一下自己';
    let generalResult = '';
    
    for await (const chunk of llm.stream(generalPrompt)) {
      generalResult += chunk;
    }
    
    console.log('General Result:', generalResult);
    console.log('General Test completed successfully');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testRetryMechanism().then(() => {
  console.log('\nAll tests completed!');
  process.exit(0);
}).catch((error) => {
  console.error('Test suite failed:', error);
  process.exit(1);
});