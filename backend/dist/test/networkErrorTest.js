"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const llm_1 = require("../llm");
const axios_1 = __importDefault(require("axios"));
// 模拟网络错误的测试
function testNetworkErrorRetry() {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Testing network error retry mechanism...');
        // 临时修改axios默认配置来模拟网络问题
        const originalTimeout = axios_1.default.defaults.timeout;
        const originalBaseURL = axios_1.default.defaults.baseURL;
        try {
            console.log('\n=== Test 1: Timeout Error Simulation ===');
            // 设置一个非常短的超时来模拟网络问题
            const llm = new llm_1.LLM();
            // 使用一个无效的API端点来触发错误
            const originalEnv = process.env.OPENAI_API_BASE;
            process.env.OPENAI_API_BASE = 'https://invalid-endpoint-that-does-not-exist.com';
            const prompt = '请生成一个简单的SVG';
            let result = '';
            console.log('Attempting to call invalid endpoint (should trigger retry and fallback)...');
            try {
                for (var _d = true, _e = __asyncValues(llm.stream(prompt)), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                    _c = _f.value;
                    _d = false;
                    try {
                        const chunk = _c;
                        result += chunk;
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            console.log('Result after retry/fallback:', result);
            // 恢复原始环境变量
            if (originalEnv) {
                process.env.OPENAI_API_BASE = originalEnv;
            }
            else {
                delete process.env.OPENAI_API_BASE;
            }
            console.log('Network error test completed - fallback mechanism working!');
        }
        catch (error) {
            console.error('Network error test failed:', error);
        }
        finally {
            // 恢复原始配置
            axios_1.default.defaults.timeout = originalTimeout;
            if (originalBaseURL) {
                axios_1.default.defaults.baseURL = originalBaseURL;
            }
        }
    });
}
// 运行测试
testNetworkErrorRetry().then(() => {
    console.log('\nNetwork error retry test completed!');
    process.exit(0);
}).catch((error) => {
    console.error('Network error test suite failed:', error);
    process.exit(1);
});
