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
Object.defineProperty(exports, "__esModule", { value: true });
const llm_1 = require("../llm");
function testRetryMechanism() {
    var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j;
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Testing LLM retry mechanism...');
        const llm = new llm_1.LLM();
        try {
            console.log('\n=== Test 1: Normal SVG generation ===');
            const svgPrompt = '请生成一个简单的蓝色圆形SVG';
            let result = '';
            try {
                for (var _k = true, _l = __asyncValues(llm.stream(svgPrompt)), _m; _m = yield _l.next(), _a = _m.done, !_a;) {
                    _c = _m.value;
                    _k = false;
                    try {
                        const chunk = _c;
                        result += chunk;
                    }
                    finally {
                        _k = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_k && !_a && (_b = _l.return)) yield _b.call(_l);
                }
                finally { if (e_1) throw e_1.error; }
            }
            console.log('SVG Result:', result);
            console.log('SVG Test completed successfully');
            console.log('\n=== Test 2: Code generation ===');
            const codePrompt = '请生成一个简单的JavaScript函数';
            let codeResult = '';
            try {
                for (var _o = true, _p = __asyncValues(llm.stream(codePrompt)), _q; _q = yield _p.next(), _d = _q.done, !_d;) {
                    _f = _q.value;
                    _o = false;
                    try {
                        const chunk = _f;
                        codeResult += chunk;
                    }
                    finally {
                        _o = true;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_o && !_d && (_e = _p.return)) yield _e.call(_p);
                }
                finally { if (e_2) throw e_2.error; }
            }
            console.log('Code Result:', codeResult);
            console.log('Code Test completed successfully');
            console.log('\n=== Test 3: General query ===');
            const generalPrompt = '你好，请介绍一下自己';
            let generalResult = '';
            try {
                for (var _r = true, _s = __asyncValues(llm.stream(generalPrompt)), _t; _t = yield _s.next(), _g = _t.done, !_g;) {
                    _j = _t.value;
                    _r = false;
                    try {
                        const chunk = _j;
                        generalResult += chunk;
                    }
                    finally {
                        _r = true;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_r && !_g && (_h = _s.return)) yield _h.call(_s);
                }
                finally { if (e_3) throw e_3.error; }
            }
            console.log('General Result:', generalResult);
            console.log('General Test completed successfully');
        }
        catch (error) {
            console.error('Test failed:', error);
        }
    });
}
// Run the test
testRetryMechanism().then(() => {
    console.log('\nAll tests completed!');
    process.exit(0);
}).catch((error) => {
    console.error('Test suite failed:', error);
    process.exit(1);
});
