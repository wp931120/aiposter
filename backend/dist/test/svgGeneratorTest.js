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
exports.runAllTests = exports.testSVGGeneration = exports.testSVGValidation = void 0;
const SVGGeneratorAgent_1 = require("../agents/SVGGeneratorAgent");
const llm_1 = require("../llm");
// 测试数据
const mockTextAnalysis = {
    keywords: ['人工智能', '未来', '创新', '科技'],
    theme: '创新科技',
    sentiment: 'positive',
    structure: { title: '创新科技', body: '探索人工智能技术在未来社会中的创新应用和发展前景' }
};
const mockLayout = {
    layoutId: 'centered-layout',
    name: '居中布局',
    description: '内容居中显示的布局',
    preview: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='
};
const mockColorScheme = {
    schemeId: 'blue-scheme',
    name: '蓝色主题',
    colors: ['#2563eb', '#3b82f6', '#06b6d4', '#f8fafc', '#1e293b']
};
// 测试用例
const testCases = [
    {
        name: '正常SVG测试',
        svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <title>测试SVG</title>
  <rect width="100%" height="100%" fill="#f8fafc" />
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="#1e293b">测试文本</text>
</svg>`
    },
    {
        name: '缺少命名空间的SVG',
        svg: `<svg viewBox="0 0 800 600">
  <rect width="100%" height="100%" fill="#f8fafc" />
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="#1e293b">测试文本</text>
</svg>`
    },
    {
        name: '标签不匹配的SVG',
        svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <g>
  <rect width="100%" height="100%" fill="#f8fafc" />
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="#1e293b">测试文本</text>
</svg>`
    },
    {
        name: '无效颜色值的SVG',
        svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="invalid-color" />
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="#1e293b">测试文本</text>
</svg>`
    },
    {
        name: '包含脚本的SVG（安全测试）',
        svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <script>alert('xss')</script>
  <rect width="100%" height="100%" fill="#f8fafc" />
  <text x="400" y="300" text-anchor="middle" font-size="24" fill="#1e293b">测试文本</text>
</svg>`
    },
    {
        name: '空SVG测试',
        svg: ''
    }
];
function testSVGValidation() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('=== SVG校验功能测试 ===\n');
        const llm = new llm_1.LLM();
        const agent = new SVGGeneratorAgent_1.SVGGeneratorAgent(llm);
        for (const testCase of testCases) {
            console.log(`测试用例: ${testCase.name}`);
            // 使用私有方法测试（需要类型断言）
            const result = agent.validateSVG(testCase.svg);
            console.log(`结果: ${result.isValid ? '✅ 有效' : '❌ 无效'}`);
            if (!result.isValid) {
                console.log('错误信息:');
                result.errors.forEach((error, index) => {
                    console.log(`  ${index + 1}. ${error}`);
                });
            }
            console.log('---\n');
        }
    });
}
exports.testSVGValidation = testSVGValidation;
function testSVGGeneration() {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        console.log('=== SVG生成功能测试 ===\n');
        const llm = new llm_1.LLM();
        const agent = new SVGGeneratorAgent_1.SVGGeneratorAgent(llm);
        try {
            console.log('开始生成SVG...');
            // 创建输入对象
            const input = {
                analysis: mockTextAnalysis,
                layout: mockLayout,
                colorScheme: mockColorScheme
            };
            // 收集流式输出
            let svgContent = '';
            const generator = agent.execute(input);
            try {
                for (var _d = true, generator_1 = __asyncValues(generator), generator_1_1; generator_1_1 = yield generator_1.next(), _a = generator_1_1.done, !_a;) {
                    _c = generator_1_1.value;
                    _d = false;
                    try {
                        const chunk = _c;
                        svgContent += chunk;
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = generator_1.return)) yield _b.call(generator_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            console.log('生成结果:');
            console.log(`- SVG长度: ${svgContent.length} 字符`);
            console.log(`- 内容预览: ${svgContent.substring(0, 100)}...`);
            // 验证生成的SVG
            const validation = agent.validateSVG(svgContent);
            console.log(`\n最终校验结果: ${validation.isValid ? '✅ 有效' : '❌ 无效'}`);
            if (!validation.isValid) {
                console.log('最终校验错误:');
                validation.errors.forEach((error, index) => {
                    console.log(`  ${index + 1}. ${error}`);
                });
            }
            else {
                console.log('✅ SVG生成成功且通过所有校验!');
            }
        }
        catch (error) {
            console.error('生成过程中发生错误:', error);
        }
    });
}
exports.testSVGGeneration = testSVGGeneration;
function runAllTests() {
    return __awaiter(this, void 0, void 0, function* () {
        yield testSVGValidation();
        yield testSVGGeneration();
    });
}
exports.runAllTests = runAllTests;
// 如果直接运行此文件
if (require.main === module) {
    runAllTests().catch(console.error);
}
