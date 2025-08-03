import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export class LLM {
  private apiKey: string;
  private model: string;
  private baseURL: string;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in the environment variables.');
    }
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_API_MODEL || 'gpt-4-turbo';
    this.baseURL = process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1';
  }

  async *stream(prompt: string): AsyncGenerator<string> {
    console.log(`\n--- LLM Stream Call ---\nPrompt: ${prompt}`);

    const maxRetries = 3;
    const retryDelay = 1000; // 1 second
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await axios.post(
          `${this.baseURL}/chat/completions`,
          {
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 50000,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            stream: true,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.apiKey}`,
            },
            responseType: 'stream',
            timeout: 30000, // 30 seconds timeout
          }
        );

        let buffer = '';
        let hasYieldedContent = false;
        
        for await (const chunk of response.data) {
          buffer += chunk.toString('utf8');
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep the last partial line in the buffer

          for (const line of lines) {
            if (line.trim().startsWith('data: ')) {
              const message = line.replace(/^data: /, '');
              if (message === '[DONE]') {
                console.log(`\n--- End LLM Stream Call ---\n`);
                return;
              }
              try {
                const parsed = JSON.parse(message);
                const content = parsed.choices[0].delta.content;
                if (content) {
                  hasYieldedContent = true;
                  yield content;
                }
              } catch (error) {
                console.error('Error parsing JSON from stream:', message, error);
              }
            }
          }
        }
        
        // If we reach here, the stream completed successfully
        if (!hasYieldedContent) {
          // Yield default content if no content was received
          yield this.getDefaultResponse(prompt);
        }
        return;
        
      } catch (error: any) {
        console.error(`Error calling OpenAI API (attempt ${attempt}/${maxRetries}):`, error.message);
        
        if (attempt === maxRetries) {
          // Final attempt failed, return default response
          console.log('All retry attempts failed, returning default response');
          yield this.getDefaultResponse(prompt);
          return;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
  }

  private getDefaultResponse(prompt: string): string {
    // Analyze prompt to provide appropriate default response
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('svg') || lowerPrompt.includes('图形') || lowerPrompt.includes('绘制')) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect x="50" y="50" width="100" height="100" fill="#3498db" stroke="#2980b9" stroke-width="2"/>
  <text x="100" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="14">默认图形</text>
</svg>`;
    }
    
    if (lowerPrompt.includes('code') || lowerPrompt.includes('代码') || lowerPrompt.includes('function')) {
      return '// 默认代码响应\nfunction defaultFunction() {\n  return "网络连接失败，这是默认响应";\n}';
    }
    
    if (lowerPrompt.includes('json')) {
      return '{"status": "default", "message": "网络连接失败，这是默认JSON响应"}';
    }
    
    // General default response
    return '抱歉，由于网络连接问题，无法获取完整响应。这是一个默认回复，请稍后重试。';
  }
}