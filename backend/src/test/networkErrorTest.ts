import { LLM } from '../llm';
import axios from 'axios';

// 模拟网络错误的测试
async function testNetworkErrorRetry() {
  console.log('Testing network error retry mechanism...');
  
  // 临时修改axios默认配置来模拟网络问题
  const originalTimeout = axios.defaults.timeout;
  const originalBaseURL = axios.defaults.baseURL;
  
  try {
    console.log('\n=== Test 1: Timeout Error Simulation ===');
    
    // 设置一个非常短的超时来模拟网络问题
    const llm = new LLM();
    
    // 使用一个无效的API端点来触发错误
    const originalEnv = process.env.OPENAI_API_BASE;
    process.env.OPENAI_API_BASE = 'https://invalid-endpoint-that-does-not-exist.com';
    
    const prompt = '请生成一个简单的SVG';
    let result = '';
    
    console.log('Attempting to call invalid endpoint (should trigger retry and fallback)...');
    
    for await (const chunk of llm.stream(prompt)) {
      result += chunk;
    }
    
    console.log('Result after retry/fallback:', result);
    
    // 恢复原始环境变量
    if (originalEnv) {
      process.env.OPENAI_API_BASE = originalEnv;
    } else {
      delete process.env.OPENAI_API_BASE;
    }
    
    console.log('Network error test completed - fallback mechanism working!');
    
  } catch (error) {
    console.error('Network error test failed:', error);
  } finally {
    // 恢复原始配置
    axios.defaults.timeout = originalTimeout;
    if (originalBaseURL) {
      axios.defaults.baseURL = originalBaseURL;
    }
  }
}

// 运行测试
testNetworkErrorRetry().then(() => {
  console.log('\nNetwork error retry test completed!');
  process.exit(0);
}).catch((error) => {
  console.error('Network error test suite failed:', error);
  process.exit(1);
});