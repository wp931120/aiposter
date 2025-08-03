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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGGeneratorAgent = void 0;
const BaseAgent_1 = require("./BaseAgent");
const prompts_1 = require("../prompts");
class SVGGeneratorAgent extends BaseAgent_1.BaseAgent {
    constructor(llm) {
        super(llm);
        this.maxRetries = 3;
    }
    validateSVG(svgContent) {
        const errors = [];
        const trimmed = svgContent.trim();
        // 检查基本格式
        if (!trimmed) {
            errors.push('SVG内容为空');
            return { isValid: false, errors };
        }
        // 检查是否以<svg开头和</svg>结尾
        if (!trimmed.startsWith('<svg')) {
            errors.push('SVG必须以<svg标签开头');
        }
        if (!trimmed.endsWith('</svg>')) {
            errors.push('SVG必须以</svg>标签结尾');
        }
        // 只有在基本格式正确的情况下才检查标签配对
        if (trimmed.startsWith('<svg') && trimmed.endsWith('</svg>')) {
            const svgOpenMatches = trimmed.match(/<svg[^>]*>/g) || [];
            const svgCloseMatches = trimmed.match(/<\/svg>/g) || [];
            if (svgOpenMatches.length !== svgCloseMatches.length) {
                errors.push('SVG开始和结束标签数量不匹配');
            }
        }
        return { isValid: errors.length === 0, errors };
    }
    generateSVGWithRetry(input, attempt = 1) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = (0, prompts_1.getSVGGeneratorPrompt)(input.analysis, input.layout, input.colorScheme) +
                (attempt > 1 ? `\n\n注意：请确保生成完整有效的SVG代码，包含正确的开始和结束标签，以及必要的viewBox或width/height属性。这是第${attempt}次尝试。` : '');
            let buffer = '';
            let svgContent = '';
            let inSvg = false;
            try {
                for (var _d = true, _e = __asyncValues(this.streamLLMRaw(prompt)), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                    _c = _f.value;
                    _d = false;
                    try {
                        const chunk = _c;
                        buffer += chunk;
                        // Look for SVG start
                        if (!inSvg && buffer.includes('<svg')) {
                            inSvg = true;
                            const svgStartIndex = buffer.indexOf('<svg');
                            svgContent = buffer.substring(svgStartIndex);
                            buffer = '';
                        }
                        else if (inSvg) {
                            svgContent += chunk;
                            if (chunk.includes('</svg>')) {
                                const svgEndIndex = svgContent.indexOf('</svg>') + 6;
                                svgContent = svgContent.substring(0, svgEndIndex);
                                break;
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
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return svgContent;
        });
    }
    execute(input) {
        return __asyncGenerator(this, arguments, function* execute_1() {
            for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
                try {
                    const svgContent = yield __await(this.generateSVGWithRetry(input, attempt));
                    const validation = this.validateSVG(svgContent);
                    if (validation.isValid) {
                        // SVG验证通过，流式输出
                        for (let i = 0; i < svgContent.length; i += 50) {
                            yield yield __await(svgContent.substring(i, i + 50));
                        }
                        return yield __await(void 0);
                    }
                    else {
                        console.warn(`SVGGeneratorAgent: 第${attempt}次尝试生成的SVG格式无效:`, validation.errors);
                        if (attempt === this.maxRetries) {
                            // 最后一次尝试失败，输出错误SVG
                            const errorSvg = this.createErrorSvg('SVG生成失败，请重试', validation.errors);
                            yield yield __await(errorSvg);
                            return yield __await(void 0);
                        }
                    }
                }
                catch (error) {
                    console.error(`SVGGeneratorAgent: 第${attempt}次尝试时发生错误:`, error);
                    if (attempt === this.maxRetries) {
                        const errorSvg = this.createErrorSvg('SVG生成错误', [`系统错误: ${error instanceof Error ? error.message : '未知错误'}`]);
                        yield yield __await(errorSvg);
                        return yield __await(void 0);
                    }
                }
            }
        });
    }
    createErrorSvg(message, errors) {
        const errorDetails = errors.slice(0, 3).map((error, index) => `<text x="400" y="${200 + (index + 1) * 25}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#999">${error}</text>`).join('');
        return `<svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#f8f9fa"/>
      <rect x="50" y="50" width="700" height="500" fill="#ffffff" stroke="#e9ecef" stroke-width="2" rx="10"/>
      <text x="400" y="150" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#dc3545" font-weight="bold">${message}</text>
      ${errorDetails}
      <text x="400" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#6c757d">请检查输入内容并重试</text>
    </svg>`;
    }
}
exports.SVGGeneratorAgent = SVGGeneratorAgent;
