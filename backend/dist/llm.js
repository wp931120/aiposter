"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLM = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
class LLM {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set in the environment variables.');
        }
        this.apiKey = process.env.OPENAI_API_KEY;
        this.model = process.env.OPENAI_API_MODEL || 'gpt-4-turbo';
        this.baseURL = process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1';
    }
    stream(prompt) {
        return __asyncGenerator(this, arguments, function* stream_1() {
            var _a, e_1, _b, _c;
            console.log(`\n--- LLM Stream Call ---\nPrompt: ${prompt}`);
            const maxRetries = 3;
            const retryDelay = 1000; // 1 second
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    const response = yield __await(axios_1.default.post(`${this.baseURL}/chat/completions`, {
                        model: this.model,
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.7,
                        max_tokens: 1500,
                        top_p: 1.0,
                        frequency_penalty: 0.0,
                        presence_penalty: 0.0,
                        stream: true,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${this.apiKey}`,
                        },
                        responseType: 'stream',
                        timeout: 30000, // 30 seconds timeout
                    }));
                    let buffer = '';
                    let hasYieldedContent = false;
                    try {
                        for (var _d = true, _e = (e_1 = void 0, __asyncValues(response.data)), _f; _f = yield __await(_e.next()), _a = _f.done, !_a;) {
                            _c = _f.value;
                            _d = false;
                            try {
                                const chunk = _c;
                                buffer += chunk.toString('utf8');
                                const lines = buffer.split('\n');
                                buffer = lines.pop() || ''; // Keep the last partial line in the buffer
                                for (const line of lines) {
                                    if (line.trim().startsWith('data: ')) {
                                        const message = line.replace(/^data: /, '');
                                        if (message === '[DONE]') {
                                            console.log(`\n--- End LLM Stream Call ---\n`);
                                            return yield __await(void 0);
                                        }
                                        try {
                                            const parsed = JSON.parse(message);
                                            const content = parsed.choices[0].delta.content;
                                            if (content) {
                                                hasYieldedContent = true;
                                                yield yield __await(content);
                                            }
                                        }
                                        catch (error) {
                                            console.error('Error parsing JSON from stream:', message, error);
                                        }
                                    }
                                }
                            }
                            finally {
                                _d = true;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    // If we reach here, the stream completed successfully
                    if (!hasYieldedContent) {
                        // Yield default content if no content was received
                        yield yield __await(this.getDefaultResponse(prompt));
                    }
                    return yield __await(void 0);
                }
                catch (error) {
                    console.error(`Error calling OpenAI API (attempt ${attempt}/${maxRetries}):`, error.message);
                    if (attempt === maxRetries) {
                        // Final attempt failed, return default response
                        console.log('All retry attempts failed, returning default response');
                        yield yield __await(this.getDefaultResponse(prompt));
                        return yield __await(void 0);
                    }
                    // Wait before retrying
                    yield __await(new Promise(resolve => setTimeout(resolve, retryDelay * attempt)));
                }
            }
        });
    }
    getDefaultResponse(prompt) {
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
exports.LLM = LLM;
